using System.Text.Json;
using ServiceWorker.Domain.Services;
using ServiceWorker.Infrastructure.Data;
using ServiceWorker.Infrastructure.PersistancyEntities;

namespace ServiceWorker.Infrastructure.Repositories.EFCore;

public class AnalysisRepository : IAnalysisRepository
{
    private readonly ServiceWorkerDbContext _dbContext;

    public AnalysisRepository(ServiceWorkerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> SaveAnalysisAsync(SkinAnalysisResult result, CancellationToken cancellationToken = default)
    {
        var entity = new SkinAnalysisPersistancyEntity
        {
            AnalysisId = result.AnalysisId,
            PacienteId = result.PacienteId,
            OverallHealthScore = result.OverallHealthScore,
            AnalyzedAt = result.AnalyzedAt,
            ConditionsJson = JsonSerializer.Serialize(result.Conditions),
            RecommendationsJson = JsonSerializer.Serialize(result.Recommendations)
        };

        _dbContext.SkinAnalyses.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<SkinAnalysisResult?> GetAnalysisAsync(Guid analysisId, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.SkinAnalyses.FindAsync(new object[] { analysisId }, cancellationToken);
        if (entity is null) return null;

        return new SkinAnalysisResult
        {
            AnalysisId = entity.AnalysisId,
            PacienteId = entity.PacienteId,
            OverallHealthScore = entity.OverallHealthScore,
            AnalyzedAt = entity.AnalyzedAt,
            Conditions = JsonSerializer.Deserialize<SkinCondition[]>(entity.ConditionsJson) ?? Array.Empty<SkinCondition>(),
            Recommendations = JsonSerializer.Deserialize<string[]>(entity.RecommendationsJson) ?? Array.Empty<string>()
        };
    }
}