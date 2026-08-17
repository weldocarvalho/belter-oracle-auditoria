export interface SkinAnalysisCompletedEvent {
  patientId: string;
  analysisId?: string;
  completedAt?: string;
  result?: unknown;
}

export interface PipelineEnvelope<T> {
  message: T;
  messageType: string[];
}
