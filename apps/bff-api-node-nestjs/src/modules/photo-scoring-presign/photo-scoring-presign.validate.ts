import { z } from 'zod';

export const PhotoScoringPresignSchema = z.object({
  fileType: z
    .string()
    .min(1)
    .regex(/^[a-z]+\/[a-z0-9.+]+$/, 'Formato de mídia inválido'),
});
