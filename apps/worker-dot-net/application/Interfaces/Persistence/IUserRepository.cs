using ServiceWorker.Domain.Entities;

namespace ServiceWorker.Application.Interfaces.Persistence;

public interface IUserRepository
{
    Task<bool> CreateUserAsync(User user, CancellationToken cancellationToken = default);
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetUserByGoogleSubjectAsync(string googleSubject, CancellationToken cancellationToken = default);
    Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken = default);
}