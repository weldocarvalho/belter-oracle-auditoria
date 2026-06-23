using MassTransit;
using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Application.Contexts.UserAppFolder;

namespace ServiceWorker.Consumers.UserAuth;

public class UserAuthConsumer(IMediator mediator, ILogger<UserAuthConsumer> logger) : IConsumer<UserAuthEventRequest>
{
    private readonly IMediator _mediator = mediator;
    private readonly ILogger<UserAuthConsumer> _logger = logger;

    public async Task Consume(ConsumeContext<UserAuthEventRequest> context)
    {
        var message = context.Message;

        _logger.LogInformation("Processing incoming MassTransit RabbitMQ registration message for: {Email}", message.Email);

        var command = new CreateUserCommand(
            message.Email,
            message.Token,
            message.AssessmentType,
            message.ManualSelectedGrade,
            message.WaterIntake,
            message.CirculationProfile
        );

        try
        {
            _logger.LogInformation("Dispatching CreateUserCommand via MediatR pipeline for user: {Email}", command.Email);
            
            var result = await _mediator.Send(command, context.CancellationToken);
            
            _logger.LogInformation("Successfully executed registration command handler for {Email}. IsNewUser: {IsNewUser}, Status: {Status}", 
                result.Email, result.IsNewUser, result.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to complete authentication processing stream inside MassTransit container for {Email}", message.Email);
            
            // Re-throw so MassTransit leaves the message in RabbitMQ for automatic retry configuration cycles or DLQ routing
            throw; 
        }
    }
}


