using MediatR;

namespace ServiceWorker.Application.Contexts.UserAppFolder;

// export interface UserAuthEventRequest {
//   email: string;
//   token: string;
//   assessmentType: string;
//   manualSelectedGrade: number;
//   waterIntake: string;
//   circulationProfile: string;
//   requestedAt: string;
// }

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
