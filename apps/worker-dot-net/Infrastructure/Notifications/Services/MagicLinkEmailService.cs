using Microsoft.Extensions.Configuration;
using ServiceWorker.Application.Interfaces.Infrastructure;
using ServiceWorker.Infrastructure.Templates;

namespace ServiceWorker.Infrastructure.Notifications.Services;

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
