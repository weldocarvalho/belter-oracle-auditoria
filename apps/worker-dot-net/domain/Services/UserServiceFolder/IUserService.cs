using ServiceWorker.Domain.Entities;
namespace ServiceWorker.Domain.Services.UserServiceFolder;

public interface IUserService
{
    Task<bool> CreateUserAsync(User user, CancellationToken cancellationToken = default);
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
}