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
            b.HasKey(u => u.Guid);
            b.HasIndex(u => u.Email).IsUnique();
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