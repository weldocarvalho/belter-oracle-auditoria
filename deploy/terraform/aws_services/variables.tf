variable "name_prefix" {
  type    = string
  default = "belter-oracle"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "app_jwt_secret" {
  type      = string
  sensitive = true
}

variable "app_jwt_expires" {
  type    = string
  default = "24h"
}

variable "cloudamqp_url" {
  type      = string
  sensitive = true
}

variable "app_aws_access_key_id" {
  type      = string
  sensitive = true
}

variable "app_aws_secret_access_key" {
  type      = string
  sensitive = true
}

variable "google_client_id" {
  type    = string
  default = ""
}

variable "aws_bucket_name" {
  type    = string
  default = "photo-scoring-presigning"
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type    = string
  default = "auditoria"
}

variable "rabbitmq_host" {
  type      = string
  sensitive = true
}

variable "rabbitmq_port" {
  type    = string
  default = "5671"
}

variable "rabbitmq_username" {
  type      = string
  sensitive = true
}

variable "rabbitmq_password" {
  type      = string
  sensitive = true
}

variable "rabbitmq_vhost" {
  type      = string
  sensitive = true
}