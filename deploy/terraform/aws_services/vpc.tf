resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "skin-saas-vpc"
  }
}

# Let's ask AWS what availability buildings (Zones) are open right now
data "aws_availability_zones" "available" {
  state = "available"
}

# Public Subnet 1 (Front Yard in Building A)
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true # Gives resources here a public internet address

  tags = { Name = "skin-saas-public-subnet-1" }
}

# Public Subnet 2 (Front Yard in Building B)
resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = { Name = "skin-saas-public-subnet-2" }
}

# Private Subnet 1 (Locked Backyard in Building A)
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = { Name = "skin-saas-private-subnet-1" }
}

# Private Subnet 2 (Locked Backyard in Building B)
resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = { Name = "skin-saas-private-subnet-2" }
}

# The Internet Gateway (The physical front gate to the internet)
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "skin-saas-igw" }
}

# The Public Route Table (The map telling public traffic to use the gate)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" # This notation means "all external internet traffic"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = { Name = "skin-saas-public-rt" }
}

# Connect Route Table to Public Subnet 1
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

# Connect Route Table to Public Subnet 2
resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}
