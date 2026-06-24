using Microsoft.EntityFrameworkCore;
using ServiceWorker.Domain.Entities;
using ServiceWorker.Infrastructure.PersistancyEntities;

namespace ServiceWorker.Infrastructure.Data;

public class ServiceWorkerDbContext : DbContext
{
    public ServiceWorkerDbContext(DbContextOptions<ServiceWorkerDbContext> options) : base(options) { }

    // USER
    public DbSet<User> Users => Set<User>();

    // TREATMENT SCHEDULE
    public DbSet<TreatmentSchedule> Schedules => Set<TreatmentSchedule>();
    public DbSet<ScheduleItem> ScheduleItems => Set<ScheduleItem>();
    public DbSet<SkinAnalysisPersistancyEntity> SkinAnalyses => Set<SkinAnalysisPersistancyEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>(b =>
    {
        // Primary Key & Indexes
        b.HasKey(u => u.Guid);
        b.HasIndex(u => u.Email).IsUnique();

        // Structural Constraints
        b.Property(u => u.Email)
         .HasMaxLength(255)
         .IsRequired();

        b.Property(u => u.SubscriptionStatus)
         .HasMaxLength(50)
         .IsRequired();

        b.Property(u => u.PixCustomerId)
         .HasMaxLength(100)
         .IsRequired(false);

        // Advanced Postgres Columns Maps
        b.Property(u => u.LPQuizDiagnosticJson)
         .HasColumnType("jsonb")
         .IsRequired();

        // Timezone management for accurate LGPD auditing and timestamps
        b.Property(u => u.LgpdConsentTimestamp)
         .HasColumnType("timestamp with time zone")
         .IsRequired();

        b.Property(u => u.CreatedAt)
         .HasColumnType("timestamp with time zone")
         .IsRequired();

        b.Property(u => u.UpdatedAt)
         .HasColumnType("timestamp with time zone")
         .IsRequired();
    });

    modelBuilder.Entity<TreatmentSchedule>(b =>
    {
        b.HasKey(c => c.Id);
        b.HasMany(c => c.Items)
         .WithOne()
         .HasForeignKey("ScheduleId")
         .OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<SkinAnalysisPersistancyEntity>(b =>
    {
        b.HasKey(e => e.AnalysisId);
        b.Property(e => e.ConditionsJson)
            .HasColumnType("jsonb")
            .IsRequired();
        b.Property(e => e.RecommendationsJson)
            .HasColumnType("jsonb")
            .IsRequired();
    });
}

}