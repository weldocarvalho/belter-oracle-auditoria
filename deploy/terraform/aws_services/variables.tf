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

variable "dotnet_frontend_url" {
  type    = string
  default = "https://*.vercel.app" # Your production frontend base URL
}

variable "dotnet_ses_from_email" {
  type    = string
  default = "SkinSaaS <weldocarvalho@outlook.com>"
}

variable "aws_bucket_name" {
  type    = string
  default = "photo-scoring-presigning"
}
