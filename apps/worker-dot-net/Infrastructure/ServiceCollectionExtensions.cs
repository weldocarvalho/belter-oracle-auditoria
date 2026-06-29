using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting; // Added for IHost extension
using Microsoft.Extensions.Logging; // Added for logging the migration process
using ServiceWorker.Domain.Services;
using ServiceWorker.Infrastructure.Data;
using ServiceWorker.Infrastructure.Repositories.EFCore;
using ServiceWorker.Infrastructure.Services;

namespace ServiceWorker.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = GetConnectionString(configuration);

        services.AddDbContext<ServiceWorkerDbContext>(options =>
            options.UseNpgsql(connectionString)
                   .UseSnakeCaseNamingConvention());

        // services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped<IAnalysisRepository, AnalysisRepository>();

        services.AddScoped<IImageProcessorService, MockImageProcessorService>();
        services.AddScoped<ISkinAnalysisService, MockSkinAnalysisService>();

        return services;
    }

    /// <summary>
    /// Safely applies pending Entity Framework Core migrations on application startup.
    /// Exits and crashes the container if the database is unreachable or migrations fail.
    /// </summary>
    public static async Task ApplyInfrastructureMigrationsAsync(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        
        // Get the logger factory using a generic or specific program category 
        var logger = services.GetRequiredService<ILogger<ServiceWorkerDbContext>>();

        try
        {
            logger.LogInformation("Checking for pending database migrations on AWS RDS...");

            var context = services.GetRequiredService<ServiceWorkerDbContext>();
            
            // This safely sends the DDL migration commands to PostgreSQL over your private network
            await context.Database.MigrateAsync();

            logger.LogInformation("Database migrations applied successfully. Database is up to date.");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "FATAL ERROR: An unhandled exception occurred during database migration. Shutting down.");
            
            // Re-throw to crash the startup pipeline. 
            // This prevents the container from running in an unhealthy state and triggers an AWS ECS rollback.
            throw; 
        }
    }

    private static string GetConnectionString(IConfiguration configuration)
    {
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTIONSTRING");
        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            return connectionString;
        }

        connectionString = configuration.GetSection("Database")["ConnectionString"];
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException
                ("Database connection string is not configured. Configure Database:ConnectionString or DATABASE_CONNECTIONSTRING.");
        }

        return connectionString;
    }
}
