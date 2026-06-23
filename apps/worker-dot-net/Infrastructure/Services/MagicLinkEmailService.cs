using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ServiceWorker.Domain.Services.UserServiceFolder;
using ServiceWorker.Infrastructure.Templates;

namespace ServiceWorker.Infrastructure.Services;

public class MagicLinkEmailService(IEmailNotificationProvider emailProvider, IConfiguration configuration) : IMagicLinkEmailService
{
    private readonly IEmailNotificationProvider _emailProvider = emailProvider;

    private readonly string _frontendBaseUrl = configuration["AppSettings:FrontendBaseUrl"]
            ?? throw new ArgumentNullException("AppSettings:FrontendBaseUrl configuration is missing.");

    public async Task SendMagicLinkAsync(string email, string token, CancellationToken cancellationToken)
    {
        // Construct the activation loop redirect URL targeting Next.js callback route
        var magicLinkUrl = $"{_frontendBaseUrl.TrimEnd('/')}/api/auth/callback?token={Uri.EscapeDataString(token)}";
        
        var htmlBody = EmailTemplates.BuildMagicLinkTemplate(magicLinkUrl);
        var subject = "✨ Seu link de acesso seguro - SkinSaaS";

        await _emailProvider.SendHtmlEmailAsync(email, subject, htmlBody, cancellationToken);
    }
}

// public class ResendEmailProvider(HttpClient httpClient, IConfiguration configuration, ILogger<ResendEmailProvider> logger): IEmailNotificationProvider
// {
//     private readonly HttpClient _httpClient = httpClient;
//     private readonly ILogger<ResendEmailProvider> _logger = logger;
//     private readonly string _fromEmailAddress = configuration["Resend:FromEmail"] ?? "weldocarvalho@outlook.com";

//     public async Task SendHtmlEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken)
//     {
//         var payload = new
//         {
//             from = _fromEmailAddress,
//             to = new[] { to },
//             subject = subject,
//             html = htmlContent
//         };

//         _logger.LogInformation("Sending transactional API request to Resend for recipient: {To}", to);

//         var response = await _httpClient.PostAsJsonAsync("v1/emails", payload, cancellationToken);

//         if (!response.IsSuccessStatusCode)
//         {
//             var errorDetails = await response.Content.ReadAsStringAsync(cancellationToken);
//             _logger.LogError("Resend API communication error. Status Code: {StatusCode}, Payload: {Details}", response.StatusCode, errorDetails);
            
//             // Re-throw to intentionally cause MediatR/RabbitMQ handler pipeline crash for automatic retry/DLQ processing
//             throw new HttpRequestException($"Failed to dispatch email via Resend Provider. Status: {response.StatusCode}");
//         }

//         _logger.LogInformation("Email successfully dispatched via Resend gateway infrastructure for {To}.", to);
//     }
// }
