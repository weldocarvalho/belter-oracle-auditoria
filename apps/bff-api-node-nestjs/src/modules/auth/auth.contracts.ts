export interface AuthenticateRequest {
  correlationId: string;
  mode: 'register' | 'login' | 'google';
  email: string;
  password?: string;
  googleSubject?: string;
  assessmentType?: string;
  manualSelectedGrade?: number;
  waterIntake?: string;
  circulationProfile?: string;
  requestedAt: string;
}

export interface AuthenticateResult {
  correlationId: string;
  success: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

export interface DiagnosticInput {
  assessmentType: string;
  manualSelectedGrade: number;
  waterIntake: string;
  circulationProfile: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  user: AuthUser;
}
