import { z } from 'zod';

export const InitiateSkinAnalysisSchema = z.object({
  patientId: z.string().uuid(),
  skinType: z.string().min(1),
  skinConcerns: z.string().min(1),
  bodyArea: z.string().min(1),
  correlationId: z.string().uuid(),
  requestedAt: z.string().datetime(),
  photoUrls: z.array(z.string()).default([]),
});
