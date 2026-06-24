using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Application.Interfaces.Infrastructure;
using ServiceWorker.Application.Interfaces.Persistence;
using ServiceWorker.Domain.Entities;

namespace ServiceWorker.Application.Cases.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreateUserCommandResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IMagicLinkEmailService _emailService;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IMagicLinkEmailService emailService,
        ILogger<CreateUserCommandHandler> logger)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<CreateUserCommandResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing registration request via JSON envelope for: {Email}", request.Email);

        try
        {
            bool isNewUser = false;
            var existingUser = await _userRepository.GetUserByEmailAsync(request.Email, cancellationToken);

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
                await _userRepository.CreateUserAsync(newUser, cancellationToken);
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
