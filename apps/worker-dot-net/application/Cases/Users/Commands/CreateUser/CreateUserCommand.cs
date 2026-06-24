using MediatR;
namespace ServiceWorker.Application.Cases.Users.Commands.CreateUser;

public record CreateUserCommand(
    string Email, 
    string Token, 
    string AssessmentType,
    int ManualSelectedGrade, 
    string WaterIntake, 
    string CirculationProfile
) : IRequest<CreateUserCommandResult>;

public record CreateUserCommandResult(
    string Email, 
    bool IsNewUser,
    string Status
);
