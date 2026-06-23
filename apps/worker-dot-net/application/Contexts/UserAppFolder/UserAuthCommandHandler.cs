using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Domain.Entities;
using ServiceWorker.Domain.Services.UserServiceFolder;

namespace ServiceWorker.Application.Contexts.UserAppFolder;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreateUserCommandResult>
{
    private readonly IUserService _userService;
    private readonly IMagicLinkEmailService _emailService;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        IUserService userService,
        IMagicLinkEmailService emailService,
        ILogger<CreateUserCommandHandler> logger)
    {
        _userService = userService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<CreateUserCommandResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing registration request via JSON envelope for: {Email}", request.Email);

        try
        {
            bool isNewUser = false;
            var existingUser = await _userService.GetUserByEmailAsync(request.Email, cancellationToken);

            // Map inputs directly to our schema-less Domain Value Object
            var inputProfile = new LPQuizDiagnostic(
                request.AssessmentType,
                request.ManualSelectedGrade,
                request.WaterIntake,
                request.CirculationProfile
            );

            if (existingUser == null)
            {
                isNewUser = true;
                var newUser = new User(request.Email, inputProfile);
                await _userService.CreateUserAsync(newUser, cancellationToken);
                _logger.LogInformation("Successfully persisted new user profile with JSON payload to PostgreSQL for {Email}.", request.Email);
            }

            // Fire and forget magic link email async out-of-band 
            _logger.LogInformation("Dispatching Magic Link to transactional provider for: {Email}", request.Email);
            await _emailService.SendMagicLinkAsync(request.Email, request.Token, cancellationToken);

            return new CreateUserCommandResult(request.Email, isNewUser, "Success");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Critical failure during background JSON profile update sequence for {Email}", request.Email);
            throw; // Propagate exception to let RabbitMQ handle retries/DLQ automatically
        }
    }
}
