// magic-link-auth.contracts.ts
export interface MassTransitEnvelope<T> {
  message: T;
  messageType: string[];
}

export interface CreateUserEventRequest {
  email: string;
  token: string;
  assessmentType: string;
  manualSelectedGrade: number;
  waterIntake: string;
  circulationProfile: string;
  requestedAt: string;
}
