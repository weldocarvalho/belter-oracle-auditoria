using ServiceWorker.Domain.Entities;
namespace ServiceWorker.Infrastructure.Repositories.UserRepoFolder;

public interface IUserRepository
{
    Task<bool> CreateUserAsync(User user, CancellationToken cancellationToken = default);
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
}