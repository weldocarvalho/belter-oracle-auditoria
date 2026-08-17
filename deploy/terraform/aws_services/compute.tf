resource "aws_ecs_cluster" "main" {
  name = "${local.name_prefix}-cluster"
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "${local.name_prefix}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_logging" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_security_group" "alb" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Permit incoming public HTTP web traffic to the load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-alb-sg" }
}

resource "aws_security_group" "containers" {
  name        = "${local.name_prefix}-containers-sg"
  description = "Isolate workloads; restrict traffic strictly to ALB entry paths"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3333
    to_port         = 3333
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-containers-sg" }
}

resource "aws_lb" "bff" {
  name               = "${local.name_prefix}-bff-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = { Name = "${local.name_prefix}-bff-alb" }
}

resource "aws_lb_target_group" "bff" {
  name        = "${local.name_prefix}-bff-tg"
  port        = 3333
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
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

resource "aws_ecs_task_definition" "nestjs_bff" {
  family                   = "${local.name_prefix}-bff"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([{
    name      = "bff"
    image     = aws_ecr_repository.nestjs_bff.repository_url
    essential = true
    portMappings = [{
      containerPort = 3333
      hostPort      = 3333
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "bff"
      }
    }

    environment = [
      { name = "DATABASE_HOST", value = aws_db_instance.postgres.address },
      { name = "RABBITMQ_URL", value = var.cloudamqp_url },
      { name = "JWT_SECRET", value = var.app_jwt_secret },
      { name = "JWT_EXPIRES_IN", value = var.app_jwt_expires },
      { name = "AWS_ACCESS_KEY_ID", value = var.app_aws_access_key_id },
      { name = "AWS_SECRET_ACCESS_KEY", value = var.app_aws_secret_access_key },
      { name = "AWS_BUCKET_NAME", value = var.aws_bucket_name },
      { name = "AWS_REGION", value = var.aws_region },
      { name = "GOOGLE_CLIENT_ID", value = var.google_client_id }
    ]
  }])
}

resource "aws_ecs_service" "nestjs_bff" {
  name            = "${local.name_prefix}-bff"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nestjs_bff.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.containers.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.bff.arn
    container_name   = "bff"
    container_port   = 3333
  }
}

resource "aws_ecs_task_definition" "dotnet_worker" {
  family                   = "${local.name_prefix}-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([{
    name      = "worker"
    image     = aws_ecr_repository.dotnet_worker.repository_url
    essential = true

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "worker"
      }
    }

    environment = [
      { name = "Logging__LogLevel__Default", value = "Information" },
      { name = "Logging__LogLevel__Microsoft", value = "Warning" },
      { name = "Logging__LogLevel__MassTransit", value = "Information" },
      { name = "RabbitMQ__Host", value = var.rabbitmq_host },
      { name = "RabbitMQ__Port", value = var.rabbitmq_port },
      { name = "RabbitMQ__Username", value = var.rabbitmq_username },
      { name = "RabbitMQ__Password", value = var.rabbitmq_password },
      { name = "RabbitMQ__VirtualHost", value = var.rabbitmq_vhost },
      { name = "Database__ConnectionString", value = "Server=${aws_db_instance.postgres.address};Port=5432;Database=${var.db_name};User Id=${var.db_username};Password=${var.db_password};" },
      { name = "AWS__Region", value = var.aws_region },
      { name = "AWS__AccessKey", value = var.app_aws_access_key_id },
      { name = "AWS__SecretKey", value = var.app_aws_secret_access_key }
    ]
  }])
}

resource "aws_ecs_service" "dotnet_worker" {
  name            = "${local.name_prefix}-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.dotnet_worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.containers.id]
    assign_public_ip = true
  }
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${local.name_prefix}"
  retention_in_days = 7
}