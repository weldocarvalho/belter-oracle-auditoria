using System;

namespace ServiceWorker.Application.Commands.Requests;

public record AuthenticateRequest
{
    public Guid CorrelationId { get; init; }
    public string Mode { get; init; } = "login";
    public string Email { get; init; } = string.Empty;
    public string? Password { get; init; }
    public string? GoogleSubject { get; init; }
    public string? AssessmentType { get; init; }
    public int? ManualSelectedGrade { get; init; }
    public string? WaterIntake { get; init; }
    public string? CirculationProfile { get; init; }
    public DateTime RequestedAt { get; init; }
}

public record AuthenticateResult
{
    public Guid CorrelationId { get; init; }
    public bool Success { get; init; }
    public Guid? UserId { get; init; }
    public string? Email { get; init; }
    public string? Error { get; init; }
}
