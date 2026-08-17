using MassTransit;
using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Application.Cases.Users.Commands.Authenticate;
using ServiceWorker.Application.Commands.Requests;

namespace ServiceWorker.Application.Consumers;

public class AuthenticateConsumer : IConsumer<AuthenticateRequest>
{
    private readonly IMediator _mediator;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<AuthenticateConsumer> _logger;

    public AuthenticateConsumer(
        IMediator mediator,
        IPublishEndpoint publishEndpoint,
        ILogger<AuthenticateConsumer> logger)
    {
        _mediator = mediator;
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<AuthenticateRequest> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Autenticando usuário. CorrelationId: {CorrelationId}, Mode: {Mode}, Email: {Email}",
            message.CorrelationId, message.Mode, message.Email);

        try
        {
            var result = await _mediator.Send(new AuthenticateCommand(
                message.CorrelationId,
                message.Mode,
                message.Email,
                message.Password,
                message.GoogleSubject,
                message.AssessmentType,
                message.ManualSelectedGrade,
                message.WaterIntake,
                message.CirculationProfile), context.CancellationToken);

            await _publishEndpoint.Publish(result, context.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Falha na autenticação. CorrelationId: {CorrelationId}, Email: {Email}",
                message.CorrelationId, message.Email);

            await _publishEndpoint.Publish(new AuthenticateResult
            {
                CorrelationId = message.CorrelationId,
                Success = false,
                Email = message.Email,
                Error = "server_error"
            }, context.CancellationToken);
        }
    }
}
