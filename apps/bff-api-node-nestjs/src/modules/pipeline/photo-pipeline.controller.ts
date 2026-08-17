import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { z } from 'zod';
import { SkinAnalysisPublisher } from '../skin-analysis/skin-analysis.publisher';
import { InitiateSkinAnalysisEvent } from '../skin-analysis/skin-analysis.contracts';

const PhotoProcessSchema = z.object({
  userId: z.string().min(1),
  fileKey: z.string().min(1),
});

@Controller('api/v1/photos')
export class PhotoPipelineController {
  constructor(private readonly skinAnalysisPublisher: SkinAnalysisPublisher) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processPhoto(
    @Body(new ZodValidationPipe(PhotoProcessSchema))
    body: {
      userId: string;
      fileKey: string;
    },
  ) {
    const event: InitiateSkinAnalysisEvent = {
      patientId: body.userId,
      skinType: '',
      skinConcerns: '',
      bodyArea: '',
      correlationId: randomUUID(),
      requestedAt: new Date().toISOString(),
      photoUrls: [body.fileKey],
    };

    await this.skinAnalysisPublisher.publishSubmission(event);

    return { success: true, status: 'PROCESSING' };
  }
}
