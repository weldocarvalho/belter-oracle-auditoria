using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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

        services.AddScoped<IAnalysisRepository, AnalysisRepository>();
        services.AddScoped<IImageProcessorService, MockImageProcessorService>();
        services.AddScoped<ISkinAnalysisService, MockSkinAnalysisService>();

        return services;
    }

    public static async Task ApplyInfrastructureMigrationsAsync(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;

        var logger = services.GetRequiredService<ILogger<ServiceWorkerDbContext>>();

        try
        {
            logger.LogInformation("Checking for pending database migrations...");

            var context = services.GetRequiredService<ServiceWorkerDbContext>();

            await context.Database.MigrateAsync();

            logger.LogInformation("Database migrations applied successfully. Database is up to date.");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "FATAL ERROR: An unhandled exception occurred during database migration. Shutting down.");

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
