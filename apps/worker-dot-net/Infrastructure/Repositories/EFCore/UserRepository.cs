using ServiceWorker.Application.Interfaces.Persistence;
using ServiceWorker.Infrastructure.Data;
using ServiceWorker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ServiceWorker.Infrastructure.Repositories.EFCore;

public class UserRepository(ServiceWorkerDbContext dbContext) : IUserRepository
{
    private readonly ServiceWorkerDbContext _dbContext = dbContext;

    public async Task<bool> CreateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Add(user);
        var entries = await _dbContext.SaveChangesAsync(cancellationToken);
        return entries > 0;
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
}