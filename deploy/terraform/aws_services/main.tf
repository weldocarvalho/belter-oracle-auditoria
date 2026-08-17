terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "belter-oracle-terraform-state"
    key            = "aws-services/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "belter-oracle-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = var.name_prefix
}