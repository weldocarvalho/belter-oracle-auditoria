export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

export const MASS_TRANSIT_CONTENT_TYPE = 'application/vnd.masstransit+json';

export const RABBITMQ_EXCHANGES = {
  initiateSkinAnalysis:
    'ServiceWorker.Application.Models:InitiateSkinAnalysisEvent',
  skinAnalysisCompleted:
    'ServiceWorker.Application.Commands.Requests:SkinAnalysisCompletedEvent',
  authenticate:
    'ServiceWorker.Application.Commands.Requests:AuthenticateRequest',
  authenticateResult:
    'ServiceWorker.Application.Commands.Requests:AuthenticateResult',
} as const;

export function buildMessageType(urn: string): string[] {
  return [`urn:message:${urn}`];
}
