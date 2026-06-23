using MassTransit;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration; 
using Serilog;
using ServiceWorker.Application.Commands.Handlers;
using ServiceWorker.Application.Consumers;
using ServiceWorker.Domain.Services;
using ServiceWorker.Infrastructure;
using ServiceWorker.Domain.Services.UserServiceFolder; 
using ServiceWorker.Infrastructure.Services;          
using System.Net.Http.Headers;
using Amazon.SimpleEmail;
using ServiceWorker.Consumers.UserAuth;                        

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
            x.AddConsumer<UserAuthConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                var logger = context.GetRequiredService<ILogger<Program>>();
                var environment = context.GetRequiredService<IHostEnvironment>();

                logger.LogInformation("Environment = {EnvironmentName}", environment.EnvironmentName);
                logger.LogDebug("UsingRabbitMq context type: {ContextType}", context.GetType().FullName);

                var rabbitMqUri = Environment.GetEnvironmentVariable("RABBITMQ_URI");

                if (!string.IsNullOrEmpty(rabbitMqUri))
                {
                    logger.LogInformation("Using RabbitMQ URI from environment variable: {RabbitMqUri}", rabbitMqUri);
                    cfg.Host(new Uri(rabbitMqUri));
                }
                else
                {
                    var rabbitSettings = context.GetRequiredService<IConfiguration>().GetSection("RabbitMQ");
                    var rabbitHost = rabbitSettings["Host"] ?? "localhost";
                    var rabbitUsername = rabbitSettings["Username"] ?? "guest";

                    logger.LogInformation("Using RabbitMQ settings from appsettings: Host={RabbitHost}, Username={RabbitUsername}", rabbitHost, rabbitUsername);

                    cfg.Host(rabbitHost, "/", h =>
                    {
                        h.Username(rabbitUsername);
                        h.Password(rabbitSettings["Password"] ?? "guest");
                    });
                }

                cfg.ConfigureEndpoints(context);
            });
        });

        services.AddHealthChecks();
        services.AddHostedService<WorkerService>();
    });

var host = builder.Build();
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
        services.AddScoped<IUserService, ServiceWorker.Infrastructure.Repositories.UserRepoFolder.UserRepository>();

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

// public static class EmailInfrastructureExtensions
// {
//     /// <summary>
//     /// Registers the low-cost Resend provider and typed HTTP Client setups for async email dispatching.
//     /// </summary>
//     public static IServiceCollection AddEmailInfrastructure(this IServiceCollection services, IConfiguration configuration)
//     {
//         services.AddScoped<IMagicLinkEmailService, MagicLinkEmailService>();

//         // Optimized typed HttpClient setup leveraging connection pooling
//         services.AddHttpClient<IEmailNotificationProvider, ResendEmailProvider>(client =>
//         {
//             client.BaseAddress = new Uri("https://resend.com");
            
//             var apiKey = configuration["Resend:ApiKey"] 
//                 ?? throw new InvalidOperationException("Resend API Key configuration is missing.");
                
//             client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
//             client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
//         });

//         return services;
//     }
// }

#endregion
