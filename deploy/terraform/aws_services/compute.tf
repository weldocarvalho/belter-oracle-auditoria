# 1. The Core ECS Cluster (The container orchestration neighborhood)
resource "aws_ecs_cluster" "main" {
  name = "skin-saas-cluster"
}

# 2. IAM Execution Roles (Gives Fargate permissions to download Docker images and write logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "skin-saas-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}


# Existing attachment
resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# NEW: Explicit permission attachment for CloudWatch Logging
resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_logging" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}


# 3. Firewalls for Compute Layers
resource "aws_security_group" "alb" {
  name        = "skin-saas-alb-sg"
  description = "Permit incoming public HTTP web traffic to the load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Vercel calling over the public web
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "skin-saas-alb-sg" }
}

resource "aws_security_group" "containers" {
  name        = "skin-saas-containers-sg"
  description = "Isolate workloads; restrict traffic strictly to ALB entry paths"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3333 # NestJS Port
    to_port         = 3333
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id] # ONLY allow requests passing through the ALB
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Needed to fetch .NET updates, connect to external CloudAMQP or OpenAI APIs
  }

  tags = { Name = "skin-saas-containers-sg" }
}

# 4. The Application Load Balancer (ALB) for NestJS BFF
resource "aws_lb" "bff" {
  name               = "skin-saas-bff-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = { Name = "skin-saas-bff-alb" }
}

resource "aws_lb_target_group" "bff" {
  name        = "skin-saas-bff-tg"
  port        = 3333
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health" # Ensure NestJS maps a basic GET /health status checker route!
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.bff.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.bff.arn
  }
}

# 5. NestJS BFF Task Definition & Serverless Fargate Service
resource "aws_ecs_task_definition" "nestjs_bff" {
  family                   = "skin-saas-nestjs-bff"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256" # 0.25 vCPU (Lowest slice, ultra low cost)
  memory                   = "512" # 0.5 GB RAM
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64" # <--- Forces AWS to use cheaper ARM64 hardware!
  }

  container_definitions = jsonencode([{
    name = "nestjs-bff"
    image = "762515454496.dkr.ecr.us-east-1.amazonaws.com/skin-saas-nestjs-bff"
    essential = true
    portMappings = [{
      containerPort = 3333
      hostPort      = 3333
    }]

    # NEW: Log Configuration Block
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "nestjs-bff"
      }
    }

    environment = [
      { name = "DATABASE_HOST", value = aws_db_instance.postgres.address },
      { name = "RABBITMQ_URL", value = var.cloudamqp_url },
      { name = "JWT_SECRET", value = var.app_jwt_secret },
      { name = "JWT_EXPIRES_IN", value = var.app_jwt_expires },
      { name = "AWS_ACCESS_KEY_ID", value = var.app_aws_access_key_id },
      { name = "AWS_SECRET_ACCESS_KEY", value = var.app_aws_secret_access_key },
      { name = "AWS_BUCKET_NAME", value = var.aws_bucket_name }
    ]
  }])
}

resource "aws_ecs_service" "nestjs_bff" {
  name            = "skin-saas-nestjs-bff"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nestjs_bff.arn
  desired_count   = 1 # Validates running a single lean node
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id] # CHANGED to Public
    security_groups  = [aws_security_group.containers.id]
    assign_public_ip = true 
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.bff.arn
    container_name   = "nestjs-bff"
    container_port   = 3333
  }
}

# 6. .NET Worker Service Task Definition & Serverless Fargate Service
resource "aws_ecs_task_definition" "dotnet_worker" {
  family                   = "skin-saas-dotnet-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256" # 0.25 vCPU
  memory                   = "512" # 0.5 GB RAM
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64" # <--- Forces AWS to use cheaper ARM64 hardware!
  }

  container_definitions = jsonencode([{
    name      = "dotnet-worker"
    image     = "762515454496.dkr.ecr.us-east-1.amazonaws.com/skin-saas-dotnet-worker"
    essential = true

    # NEW: Log Configuration Block
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "dotnet-worker"
      }
    }
    
    environment = [
      # 1. Logging Levels
      { name = "Logging__LogLevel__Default", value = "Information" },
      { name = "Logging__LogLevel__Microsoft", value = "Warning" },
      { name = "Logging__LogLevel__MassTransit", value = "Information" },

      # 2. RabbitMQ Configuration (Points directly to your Free CloudAMQP)
      { name = "RabbitMQ__Host", value = "leopard.lmq.cloudamqp.com" },
      { name = "RabbitMQ__Port", value = "5671" }, # Standard AMQPS port
      { name = "RabbitMQ__Username", value = "***REMOVED***" },
      { name = "RabbitMQ__Password", value = "***REMOVED***" },
      { name = "RabbitMQ__VirtualHost", value = "***REMOVED***" },

      # 3. Database Connection (Mapped directly to your live RDS credentials!)
      { name = "Database__ConnectionString", value = "Server=${aws_db_instance.postgres.address};Port=5432;Database=skinsaas;User Id=***REMOVED***;Password=***REMOVED***;" },

      # 4. AppSettings
      { name = "AppSettings__FrontendBaseUrl", value = var.dotnet_frontend_url },

      # 5. AWS Credentials & SES (Injected securely from variables)
      { name = "AWS__Region", value = "us-east-1" },
      { name = "AWS__AccessKey", value = var.app_aws_access_key_id },
      { name = "AWS__SecretKey", value = var.app_aws_secret_access_key },
      { name = "AWS__SES__FromEmail", value = var.dotnet_ses_from_email }
    ]
  }])
}

resource "aws_ecs_service" "dotnet_worker" {
  name            = "skin-saas-dotnet-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.dotnet_worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id] # CHANGED to Public
    security_groups  = [aws_security_group.containers.id]
    assign_public_ip = true
  }
}

# CloudWatch Log Group to collect container stdout/stderr
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/skin-saas-platform"
  retention_in_days = 7 # Automatically purges old logs to keep costs low

  # ADD THIS: Minor metadata modification to force a state sync!
  tags = {
    "EnvironmentSweep" = "Forced-Sync-2026-06-26"
  }
}
