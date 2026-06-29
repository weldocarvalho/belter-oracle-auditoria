resource "aws_ecr_repository" "nestjs_bff" {
  name                 = "skin-saas-nestjs-bff"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

resource "aws_ecr_repository" "dotnet_worker" {
  name                 = "skin-saas-dotnet-worker"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

output "nestjs_ecr_url" {
  value = aws_ecr_repository.nestjs_bff.repository_url
}

output "dotnet_ecr_url" {
  value = aws_ecr_repository.dotnet_worker.repository_url
}
