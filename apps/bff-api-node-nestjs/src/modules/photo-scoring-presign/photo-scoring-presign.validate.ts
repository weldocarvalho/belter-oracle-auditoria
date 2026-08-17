import { z } from 'zod';

export const PhotoScoringPresignSchema = z.object({
  patientId: z.string().min(1),
  fileType: z
    .string()
    .min(1)
    .regex(/^[a-z]+\/[a-z0-9.+]+$/, 'Formato de mídia inválido'),
});
