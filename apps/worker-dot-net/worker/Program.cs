using Amazon.SimpleEmail;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using ServiceWorker.Application.Commands.Handlers;
using ServiceWorker.Application.Consumers;
using ServiceWorker.Application.Interfaces.Persistence;
using ServiceWorker.Application.Interfaces.Infrastructure;
using ServiceWorker.Consumers.CreateUser;
using ServiceWorker.Infrastructure;
using ServiceWorker.Infrastructure.Notifications.Providers;
using ServiceWorker.Infrastructure.Notifications.Services;
using ServiceWorker.Infrastructure.Repositories.EFCore;

var builder = Host.CreateDefaultBuilder(args)
    .UseSerilog((context, configuration) =>
    {
        configuration
            .MinimumLevel.Information()
            .WriteTo.Console(outputTemplate:
                "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(
                "logs/worker-.txt",
                rollingInterval: RollingInterval.Day,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}");

        if (context.HostingEnvironment.IsDevelopment())
        {
            configuration.MinimumLevel.Debug();
        }
    })
    .ConfigureServices((context, services) =>
    {
        services.AddInfrastructure(context.Configuration);

        // Cleanly inject your production AWS SES transactional email pipeline
        services.AddEmailInfrastructure(context.Configuration);

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AnalyzeSkinCommandHandler).Assembly));

        services.AddMassTransit(x =>
        {
            x.AddConsumer<SkinAnalysisConsumer>();
            x.AddConsumer<CreateUserConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                var logger = context.GetRequiredService<ILogger<Program>>();
                var environment = context.GetRequiredService<IHostEnvironment>();

                logger.LogInformation("Environment = {EnvironmentName}", environment.EnvironmentName);

                // Read values dynamically from your configuration provider
                var configuration = context.GetRequiredService<IConfiguration>();
                var rabbitSettings = configuration.GetSection("RabbitMQ");

                // Extract configurations with secure fallbacks for local docker-compose environments
                // var rabbitHost = rabbitSettings["Host"] ?? "localhost";
                // var rabbitPortStr = rabbitSettings["Port"] ?? "5672";
                // var rabbitUsername = rabbitSettings["Username"] ?? "guest";
                // var rabbitPassword = rabbitSettings["Password"] ?? "guest";
                // var rabbitVirtualHost = rabbitSettings["VirtualHost"] ?? "/"; // <--- Dynamic Read

                var rabbitHost = "leopard.lmq.cloudamqp.com";
                var rabbitPortStr = "5671";
                var rabbitUsername = "***REMOVED***";
                var rabbitPassword = "***REMOVED***";
                var rabbitVirtualHost = "***REMOVED***";

                ushort rabbitPort = ushort.TryParse(rabbitPortStr, out var parsedPort) ? parsedPort : (ushort)5672;

                logger.LogInformation("Connecting MassTransit to Host={RabbitHost}, Port={RabbitPort}, VirtualHost={rabbitVirtualHost}, Username={RabbitUsername}",
                    rabbitHost, rabbitPort, rabbitVirtualHost, rabbitUsername);

                // ✅ FIXED: Enforce dynamic host routing assembly parameters
                cfg.Host(rabbitHost, rabbitPort, rabbitVirtualHost, h =>
                {
                    h.Username(rabbitUsername);
                    h.Password(rabbitPassword);

                    // Secure automated handshake upgrade for CloudAMQP production AMQPS endpoints
                    // if (rabbitPort != 5671)
                    // {
                    //     h.UseSsl(s => s.Protocol = System.Security.Authentication.SslProtocols.Tls12);
                    // }

                });

                cfg.ConfigureEndpoints(context);
            });

        });

        services.AddHealthChecks();
        services.AddHostedService<WorkerService>();
    });

var host = builder.Build();
await host.ApplyInfrastructureMigrationsAsync();
await host.RunAsync();

public class WorkerService : BackgroundService
{
    private readonly ILogger<WorkerService> _logger;
    private readonly IBusControl _busControl;

    public WorkerService(ILogger<WorkerService> logger, IBusControl busControl)
    {
        _logger = logger;
        _busControl = busControl;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 Vamos ver se está aqui... ServiceWorker iniciado - aguardando mensagens...");

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        await _busControl.StartAsync(cancellationToken);
        await base.StartAsync(cancellationToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _busControl.StopAsync(cancellationToken);
        await base.StopAsync(cancellationToken);
    }
}

#region Infrastructure Service Extensions
public static class EmailInfrastructureExtensions
{
    /// <summary>
    /// Registers the low-cost AWS SES provider, domain user services, and native SDK dependencies.
    /// </summary>
    public static IServiceCollection AddEmailInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Core Authentication Mail Pipeline Registrations
        services.AddScoped<IMagicLinkEmailService, MagicLinkEmailService>();
        services.AddScoped<IEmailNotificationProvider, AwsSesEmailProvider>();

        // 2. Explicitly map your Domain Service Interface to its repository implementation
        services.AddScoped<IUserRepository, UserRepository>();

        // 3. MANUAL OVERRIDE FIX: Parse keys directly to stop automatic system profile searching loops
        var awsSection = configuration.GetSection("AWS");

        var accessKey = awsSection["AccessKey"] ?? throw new InvalidOperationException("AWS:AccessKey is missing.");
        var secretKey = awsSection["SecretKey"] ?? throw new InvalidOperationException("AWS:SecretKey is missing.");
        var regionName = awsSection["Region"] ?? "us-east-1";

        var region = Amazon.RegionEndpoint.GetBySystemName(regionName);
        var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);

        // Explicitly instantiate and inject the service instance as a Singleton to optimize execution lifecycle
        var sesClient = new Amazon.SimpleEmail.AmazonSimpleEmailServiceClient(credentials, region);
        services.AddSingleton<IAmazonSimpleEmailService>(sesClient);

        return services;
    }
}

#endregion
