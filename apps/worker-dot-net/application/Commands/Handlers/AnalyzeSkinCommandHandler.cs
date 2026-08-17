using MassTransit;
using MediatR;
using Microsoft.Extensions.Logging;
using ServiceWorker.Application.Commands.Requests;
using ServiceWorker.Domain.Services;

namespace ServiceWorker.Application.Commands.Handlers;

public class AnalyzeSkinCommandHandler : IRequestHandler<AnalyzeSkinCommand, AnalyzeSkinCommandResult>
{
    private readonly ISkinAnalysisService _skinAnalysisService;
    private readonly IAnalysisRepository _analysisRepository;
    private readonly IPublisher _publisher;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<AnalyzeSkinCommandHandler> _logger;

    public AnalyzeSkinCommandHandler(
        ISkinAnalysisService skinAnalysisService,
        IAnalysisRepository analysisRepository,
        IPublisher publisher,
        IPublishEndpoint publishEndpoint,
        ILogger<AnalyzeSkinCommandHandler> logger)
    {
        _skinAnalysisService = skinAnalysisService;
        _analysisRepository = analysisRepository;
        _publisher = publisher;
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task<AnalyzeSkinCommandResult> Handle(AnalyzeSkinCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Iniciando análise. CorrelationId: {CorrelationId}, PatientId: {PatientId}",
            request.CorrelationId, request.PatientId);

        try
        {
            var imageData = Array.Empty<byte>();

            var analysisResult = await _skinAnalysisService.AnalyzeSkinAsync(
                imageData,
                request.PatientId,
                cancellationToken);

            var saved = await _analysisRepository.SaveAnalysisAsync(analysisResult, cancellationToken);

            _logger.LogInformation(
                "Análise concluída. CorrelationId: {CorrelationId}, AnalysisId: {AnalysisId}",
                request.CorrelationId, analysisResult.AnalysisId);

            var completedEvent = new SkinAnalysisCompletedEvent(
                analysisResult.AnalysisId,
                request.PatientId,
                request.CorrelationId,
                analysisResult);

            await _publishEndpoint.Publish(completedEvent, cancellationToken);

            await _publisher.Publish(completedEvent, cancellationToken);

            return new AnalyzeSkinCommandResult
            {
                AnalysisId = analysisResult.AnalysisId,
                PatientId = analysisResult.PacienteId,
                Conditions = analysisResult.Conditions,
                OverallHealthScore = analysisResult.OverallHealthScore,
                Recommendations = analysisResult.Recommendations,
                AnalyzedAt = analysisResult.AnalyzedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Erro ao processar análise de pele. CorrelationId: {CorrelationId}, PatientId: {PatientId}",
                request.CorrelationId, request.PatientId);
            throw;
        }
    }
}
