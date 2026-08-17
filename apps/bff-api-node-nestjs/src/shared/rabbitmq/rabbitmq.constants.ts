export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

export const MASS_TRANSIT_CONTENT_TYPE = 'application/vnd.masstransit+json';

export const RABBITMQ_EXCHANGES = {
  initiateSkinAnalysis:
    'DermePlan.Worker.Application.Models:InitiateSkinAnalysisEvent',
  createUser: 'ServiceWorker.Consumers.CreateUser:CreateUserEventRequest',
  skinAnalysisCompleted:
    'ServiceWorker.Application.Commands.Requests:SkinAnalysisCompletedEvent',
} as const;

export function buildMessageType(urn: string): string[] {
  return [`urn:message:${urn}`];
}
