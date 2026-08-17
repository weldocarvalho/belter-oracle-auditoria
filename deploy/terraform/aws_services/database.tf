resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = { Name = "${local.name_prefix}-db-subnet-group" }
}

resource "aws_security_group" "db" {
  name        = "${local.name_prefix}-db-sg"
  description = "Block all public internet access; permit internal traffic exclusively"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow explicit access from ECS application containers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.containers.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-db-sg" }
}

resource "aws_db_instance" "postgres" {
  identifier            = "${local.name_prefix}-postgres"
  engine                = "postgres"
  engine_version        = "15"
  instance_class        = "db.t4g.micro"
  allocated_storage     = 20
  max_allocated_storage = 100
  db_name               = var.db_name
  username              = var.db_username
  password              = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false
  skip_final_snapshot    = true

  tags = { Name = "${local.name_prefix}-postgres" }
}