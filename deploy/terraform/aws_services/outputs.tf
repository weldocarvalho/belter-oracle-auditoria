output "nestjs_api_endpoint" {
  description = "The public URL for the BFF API. Inject this into Vercel!"
  value       = "http://${aws_lb.bff.dns_name}"
}