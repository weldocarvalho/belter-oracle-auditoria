using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ServiceWorker.Domain.Services.UserServiceFolder;

namespace ServiceWorker.Infrastructure.Services;

public class AwsSesEmailProvider : IEmailNotificationProvider
{
    private readonly IAmazonSimpleEmailService _sesClient;
    private readonly ILogger<AwsSesEmailProvider> _logger;
    private readonly string _fromEmailAddress;

    public AwsSesEmailProvider(
        IAmazonSimpleEmailService sesClient, 
        IConfiguration configuration, 
        ILogger<AwsSesEmailProvider> logger)
    {
        _sesClient = sesClient;
        _logger = logger;
        // Example: "SkinSaaS <onboarding@yourdomain.com>" or verified SES identity email
        _fromEmailAddress = configuration["AWS:SES:FromEmail"] 
            ?? throw new ArgumentNullException("AWS:SES:FromEmail configuration is missing.");
    }

    public async Task SendHtmlEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken)
    {
        var sendRequest = new SendEmailRequest
        {
            Source = _fromEmailAddress,
            Destination = new Destination
            {
                ToAddresses = new List<string> { to }
            },
            Message = new Message
            {
                Subject = new Content(subject),
                Body = new Body
                {
                    Html = new Content
                    {
                        Charset = "UTF-8",
                        Data = htmlContent
                    }
                }
            }
        };

        try
        {
            _logger.LogInformation("Attempting to send transactional email via AWS SES to: {To}", to);
            
            var response = await _sesClient.SendEmailAsync(sendRequest, cancellationToken);
            
            _logger.LogInformation("Email successfully dispatched via AWS SES. MessageId: {MessageId} for {To}", response.MessageId, to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AWS SES Infrastructure failure while sending email to {To}", to);
            
            // Re-throw exception so MediatR and MassTransit/RabbitMQ can handle retries or route to the Dead Letter Queue
            throw;
        }
    }
}
