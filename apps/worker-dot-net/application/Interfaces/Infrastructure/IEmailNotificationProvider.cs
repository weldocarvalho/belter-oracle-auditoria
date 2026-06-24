namespace ServiceWorker.Application.Interfaces.Infrastructure;

public interface IEmailNotificationProvider
{
    /// <summary>
    /// Low-level abstraction for the transactional email transport infrastructure (e.g., Resend, SES).
    /// </summary>
    Task SendHtmlEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken);
}
