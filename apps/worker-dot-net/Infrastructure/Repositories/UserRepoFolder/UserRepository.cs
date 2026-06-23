using ServiceWorker.Infrastructure.Data;
using ServiceWorker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using ServiceWorker.Domain.Services.UserServiceFolder;

namespace ServiceWorker.Infrastructure.Repositories.UserRepoFolder;

public class UserRepository(ServiceWorkerDbContext dbContext): IUserService
{
    private readonly ServiceWorkerDbContext _dbContext = dbContext;

    public async Task<bool> CreateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        // _dbContext.Users.Add(user);
        // await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        // return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        return null;
    }
}