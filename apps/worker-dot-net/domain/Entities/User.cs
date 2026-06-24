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
    public string? PixCustomerId { get; private set; } = null; // For Asaas/Stripe/MercadoPago webhooks

    public string LPQuizDiagnosticJson { get; private set; } = string.Empty;

    // LGPD Compliance Telemetry
    public bool LgpdConsentGranted { get; private set; }
    public DateTime LgpdConsentTimestamp { get; private set; } // Changed to non-nullable to match domain intent

    // System Telemetry
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private User() { } // EF Core Hydration Constructor

    public User(string email, LPQuizDiagnostic skinProfile)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required.");
        if (skinProfile == null) throw new ArgumentNullException(nameof(skinProfile));

        Guid = Guid.NewGuid();
        Email = email.ToLowerInvariant().Trim();
        IsVerified = false;
        SubscriptionStatus = "free"; // All users start on the free tier until Pix webhook triggers
        PixCustomerId = null;

        LPQuizDiagnosticJson = JsonSerializer.Serialize(skinProfile);

        LgpdConsentGranted = true;
        LgpdConsentTimestamp = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    // Domain Method to update subscription state via payment webhook processing
    public void UpdateSubscription(string status)
    {
        if (string.IsNullOrWhiteSpace(status)) throw new ArgumentException("Status cannot be empty.");
        SubscriptionStatus = status;
        UpdatedAt = DateTime.UtcNow;
    }

    // Domain Method to bind the Pix gateway customer tracking ID
    public void LinkPixCustomer(string pixCustomerId)
    {
        if (string.IsNullOrWhiteSpace(pixCustomerId)) throw new ArgumentException("Customer ID cannot be empty.");
        PixCustomerId = pixCustomerId;
        UpdatedAt = DateTime.UtcNow;
    }

    public LPQuizDiagnostic? GetLPQuizDiagnostic()
    {
        if (string.IsNullOrWhiteSpace(LPQuizDiagnosticJson)) return null;
        return JsonSerializer.Deserialize<LPQuizDiagnostic>(LPQuizDiagnosticJson);
    }
}
