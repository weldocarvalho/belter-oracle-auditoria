using MediatR;
using ServiceWorker.Application.Commands.Requests;

namespace ServiceWorker.Application.Cases.Users.Commands.Authenticate;

public record AuthenticateCommand(
    Guid CorrelationId,
    string Mode,
    string Email,
    string? Password,
    string? GoogleSubject,
    string? AssessmentType,
    int? ManualSelectedGrade,
    string? WaterIntake,
    string? CirculationProfile
) : IRequest<AuthenticateResult>;
