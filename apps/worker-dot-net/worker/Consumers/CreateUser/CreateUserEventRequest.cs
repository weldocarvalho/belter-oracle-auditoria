namespace ServiceWorker.Consumers.CreateUser;

/// <summary>
/// This interface/record represents the contract coming from your NestJS BFF via RabbitMQ.
/// </summary>
public record CreateUserEventRequest
{
    public string Email { get; init; } = default!;
    public string Token { get; init; } = default!;
    public string AssessmentType { get; init; } = default!;
    public int ManualSelectedGrade { get; init; } // maps into ActiveGrade
    public string WaterIntake { get; init; } = default!;
    public string CirculationProfile { get; init; } = default!;
    public DateTime RequestedAt { get; init; }
}
