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
    public string Email { get; private set; }
    public bool IsVerified { get; private set; }
    
    // The single database field storing the stringified JSON payload
    public string LPQuizDiagnosticJson { get; private set; }

    // LGPD Compliance Telemetry
    public bool LgpdConsentGranted { get; private set; }
    public DateTime? LgpdConsentTimestamp { get; private set; }

    private User() { } // EF Core / Hydration constructor

    public User(string email, LPQuizDiagnostic skinProfile)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required.");
        if (skinProfile == null) throw new ArgumentNullException(nameof(skinProfile));
        
        Guid = Guid.NewGuid();
        Email = email.ToLowerInvariant().Trim();
        IsVerified = false;
        
        // Serialize the value object directly into the string property
        LPQuizDiagnosticJson = JsonSerializer.Serialize(skinProfile);
        
        LgpdConsentGranted = true; 
        LgpdConsentTimestamp = DateTime.UtcNow;
    }

    // Helper method to turn the string back into a strong C# object inside your domain
    public LPQuizDiagnostic? GetLPQuizDiagnostic()
    {
        if (string.IsNullOrWhiteSpace(LPQuizDiagnosticJson)) return null;
        return JsonSerializer.Deserialize<LPQuizDiagnostic>(LPQuizDiagnosticJson);
    }
}
