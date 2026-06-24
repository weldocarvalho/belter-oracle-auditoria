namespace ServiceWorker.Application.Interfaces.Infrastructure;

public interface IMagicLinkEmailService
{
    /// <summary>
    /// Dispatches an asynchronous magic link login email to a specific user.
    /// </summary>
    Task SendMagicLinkAsync(string email, string token, CancellationToken cancellationToken);
}