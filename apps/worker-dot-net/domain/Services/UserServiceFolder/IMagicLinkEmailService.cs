namespace ServiceWorker.Domain.Services.UserServiceFolder;

public interface IMagicLinkEmailService
{
    /// <summary>
    /// Dispatches an asynchronous magic link login email to a specific user.
    /// </summary>
    Task SendMagicLinkAsync(string email, string token, CancellationToken cancellationToken);
}

public interface IEmailNotificationProvider
{
    /// <summary>
    /// Low-level abstraction for the transactional email transport infrastructure (e.g., Resend, SES).
    /// </summary>
    Task SendHtmlEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken);
}
