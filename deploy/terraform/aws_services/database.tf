# 1. Tell AWS which private subnets our database is allowed to inhabit
resource "aws_db_subnet_group" "main" {
  name       = "skin-saas-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = { Name = "skin-saas-db-subnet-group" }
}

# 2. The Database Firewall (Security Group)
resource "aws_security_group" "db" {
  name        = "skin-saas-db-sg"
  description = "Block all public internet access; permit internal traffic exclusively"
  vpc_id      = aws_vpc.main.id

  # Incoming Traffic Control
  ingress {
    description     = "Allow explicit access from ECS application containers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.containers.id] # Explicit security group linking
  }

  # Outgoing Traffic Control
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "skin-saas-db-sg" }
}

# 3. The PostgreSQL Managed Instance
resource "aws_db_instance" "postgres" {
  identifier             = "skin-saas-postgres"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t4g.micro" # High efficiency, ultra low-cost ARM Graviton node
  allocated_storage      = 20             # 20 GB baseline storage
  max_allocated_storage  = 100            # Autoscales up to 100 GB if database expands
  db_name                = "skinsaas"
  
  # Core Administrative Credentials
  username               = "***REMOVED***"
  password               = "***REMOVED***" # Change this to your private password later!
  
  # Network & Isolation Topologies
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false   # Absolute lockdown: invisible to the outside internet
  skip_final_snapshot    = true    # Fast teardown without saving state files during validation

  tags = { Name = "skin-saas-postgres" }
}
