using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Application.Commands.Requests;
using ServiceWorker.Application.Interfaces.Infrastructure;
using ServiceWorker.Application.Interfaces.Persistence;
using ServiceWorker.Domain.Entities;

namespace ServiceWorker.Application.Cases.Users.Commands.Authenticate;

public class AuthenticateCommandHandler : IRequestHandler<AuthenticateCommand, AuthenticateResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<AuthenticateCommandHandler> _logger;

    public AuthenticateCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ILogger<AuthenticateCommandHandler> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<AuthenticateResult> Handle(AuthenticateCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        try
        {
            return request.Mode switch
            {
                "register" => await HandleRegister(request, email, cancellationToken),
                "login" => await HandleLogin(request, email, cancellationToken),
                "google" => await HandleGoogle(request, email, cancellationToken),
                _ => new AuthenticateResult
                {
                    CorrelationId = request.CorrelationId,
                    Success = false,
                    Email = email,
                    Error = "invalid_mode"
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Falha crítica durante autenticação de {Email}", email);
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "server_error"
            };
        }
    }

    private async Task<AuthenticateResult> HandleRegister(
        AuthenticateCommand request,
        string email,
        CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetUserByEmailAsync(email, cancellationToken);
        if (existingUser != null)
        {
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "email_in_use"
            };
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "password_required"
            };
        }

        var profile = new LPQuizDiagnostic(
            request.AssessmentType ?? string.Empty,
            request.ManualSelectedGrade ?? 0,
            request.WaterIntake ?? string.Empty,
            request.CirculationProfile ?? string.Empty
        );

        var passwordHash = _passwordHasher.Hash(request.Password);
        var newUser = new User(email, profile, passwordHash, authProvider: "credentials");

        await _userRepository.CreateUserAsync(newUser, cancellationToken);
        _logger.LogInformation("Usuário registrado com sucesso: {Email}", email);

        return new AuthenticateResult
        {
            CorrelationId = request.CorrelationId,
            Success = true,
            UserId = newUser.Guid,
            Email = email
        };
    }

    private async Task<AuthenticateResult> HandleLogin(
        AuthenticateCommand request,
        string email,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserByEmailAsync(email, cancellationToken);
        if (user == null || user.PasswordHash == null)
        {
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "invalid_credentials"
            };
        }

        var passwordValid = _passwordHasher.Verify(request.Password ?? string.Empty, user.PasswordHash);
        if (!passwordValid)
        {
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "invalid_credentials"
            };
        }

        _logger.LogInformation("Login realizado com sucesso: {Email}", email);

        return new AuthenticateResult
        {
            CorrelationId = request.CorrelationId,
            Success = true,
            UserId = user.Guid,
            Email = email
        };
    }

    private async Task<AuthenticateResult> HandleGoogle(
        AuthenticateCommand request,
        string email,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.GoogleSubject))
        {
            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = false,
                Email = email,
                Error = "google_subject_required"
            };
        }

        var user = await _userRepository.GetUserByGoogleSubjectAsync(request.GoogleSubject, cancellationToken);
        if (user == null)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(email, cancellationToken);
            user = existingUser;
        }

        if (user == null)
        {
            var profile = new LPQuizDiagnostic(
                request.AssessmentType ?? string.Empty,
                request.ManualSelectedGrade ?? 0,
                request.WaterIntake ?? string.Empty,
                request.CirculationProfile ?? string.Empty
            );

            var newUser = new User(email, profile, googleSubject: request.GoogleSubject, authProvider: "google");
            await _userRepository.CreateUserAsync(newUser, cancellationToken);
            _logger.LogInformation("Usuário criado via Google: {Email}", email);

            return new AuthenticateResult
            {
                CorrelationId = request.CorrelationId,
                Success = true,
                UserId = newUser.Guid,
                Email = email
            };
        }

        if (user.GoogleSubject != request.GoogleSubject)
        {
            user.LinkGoogle(request.GoogleSubject);
            await _userRepository.UpdateUserAsync(user, cancellationToken);
        }

        _logger.LogInformation("Login via Google realizado com sucesso: {Email}", email);

        return new AuthenticateResult
        {
            CorrelationId = request.CorrelationId,
            Success = true,
            UserId = user.Guid,
            Email = email
        };
    }
}
