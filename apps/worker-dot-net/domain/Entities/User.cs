using System.Text.Json;

namespace ServiceWorker.Domain.Entities;

public record LPQuizDiagnostic(
    string AssessmentType,
    int ManualSelectedGrade,
    string WaterIntake,
    string CirculationProfile
);

public class User
{
    public Guid Guid { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public bool IsVerified { get; private set; } = false;
    public string SubscriptionStatus { get; private set; } = "PENDING";
    public string? PixCustomerId { get; private set; } = null;
    public string AuthProvider { get; private set; } = "credentials";
    public string? PasswordHash { get; private set; }
    public string? GoogleSubject { get; private set; }

    public string LPQuizDiagnosticJson { get; private set; } = string.Empty;

    public bool LgpdConsentGranted { get; private set; }
    public DateTime LgpdConsentTimestamp { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private User() { }

    public User(
        string email,
        LPQuizDiagnostic skinProfile,
        string? passwordHash = null,
        string? googleSubject = null,
        string authProvider = "credentials")
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required.");
        if (skinProfile == null) throw new ArgumentNullException(nameof(skinProfile));

        Guid = Guid.NewGuid();
        Email = email.ToLowerInvariant().Trim();
        IsVerified = authProvider == "google";
        SubscriptionStatus = "free";
        PixCustomerId = null;
        AuthProvider = authProvider;
        PasswordHash = passwordHash;
        GoogleSubject = googleSubject;

        LPQuizDiagnosticJson = JsonSerializer.Serialize(skinProfile);

        LgpdConsentGranted = true;
        LgpdConsentTimestamp = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateSubscription(string status)
    {
        if (string.IsNullOrWhiteSpace(status)) throw new ArgumentException("Status cannot be empty.");
        SubscriptionStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void LinkPixCustomer(string pixCustomerId)
    {
        if (string.IsNullOrWhiteSpace(pixCustomerId)) throw new ArgumentException("Customer ID cannot be empty.");
        PixCustomerId = pixCustomerId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void LinkGoogle(string googleSubject)
    {
        if (string.IsNullOrWhiteSpace(googleSubject)) throw new ArgumentException("Google subject cannot be empty.");
        AuthProvider = "google";
        GoogleSubject = googleSubject;
        IsVerified = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public LPQuizDiagnostic? GetLPQuizDiagnostic()
    {
        if (string.IsNullOrWhiteSpace(LPQuizDiagnosticJson)) return null;
        return JsonSerializer.Deserialize<LPQuizDiagnostic>(LPQuizDiagnosticJson);
    }
}