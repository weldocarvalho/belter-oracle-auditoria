using Amazon.SimpleEmail;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using ServiceWorker.Application.Commands.Handlers;
using ServiceWorker.Application.Consumers;
using ServiceWorker.Application.Interfaces.Infrastructure;
using ServiceWorker.Application.Interfaces.Persistence;
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
        services.AddEmailInfrastructure(context.Configuration);

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AnalyzeSkinCommandHandler).Assembly));

        services.AddMassTransit(x =>
        {
            x.AddConsumer<SkinAnalysisConsumer>();
            x.AddConsumer<CreateUserConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                var configuration = context.GetRequiredService<IConfiguration>();
                var rabbit = configuration.GetSection("RabbitMQ");

                var host = rabbit["Host"] ?? "localhost";
                var port = ushort.TryParse(rabbit["Port"], out var parsedPort) ? parsedPort : (ushort)5672;
                var username = rabbit["Username"] ?? "guest";
                var password = rabbit["Password"] ?? "guest";
                var virtualHost = rabbit["VirtualHost"] ?? "/";

                cfg.Host(host, port, virtualHost, h =>
                {
                    h.Username(username);
                    h.Password(password);

                    if (port == 5671)
                    {
                        h.UseSsl(s => s.Protocol = System.Security.Authentication.SslProtocols.Tls12);
                    }
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
        _logger.LogInformation("ServiceWorker iniciado - aguardando mensagens...");

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

public static class EmailInfrastructureExtensions
{
    public static IServiceCollection AddEmailInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IMagicLinkEmailService, MagicLinkEmailService>();
        services.AddScoped<IEmailNotificationProvider, AwsSesEmailProvider>();
        services.AddScoped<IUserRepository, UserRepository>();

        var awsSection = configuration.GetSection("AWS");

        var accessKey = awsSection["AccessKey"] ?? throw new InvalidOperationException("AWS:AccessKey is missing.");
        var secretKey = awsSection["SecretKey"] ?? throw new InvalidOperationException("AWS:SecretKey is missing.");
        var regionName = awsSection["Region"] ?? "us-east-1";

        var region = Amazon.RegionEndpoint.GetBySystemName(regionName);
        var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);

        var sesClient = new AmazonSimpleEmailServiceClient(credentials, region);
        services.AddSingleton<IAmazonSimpleEmailService>(sesClient);

        return services;
    }
}
