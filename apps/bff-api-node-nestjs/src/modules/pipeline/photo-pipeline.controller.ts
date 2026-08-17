import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { z } from 'zod';
import { SkinAnalysisPublisher } from '../skin-analysis/skin-analysis.publisher';
import { InitiateSkinAnalysisEvent } from '../skin-analysis/skin-analysis.contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt-auth.guard';

const PhotoProcessSchema = z.object({
  fileKey: z.string().min(1),
});

@Controller('api/v1/photos')
export class PhotoPipelineController {
  constructor(private readonly skinAnalysisPublisher: SkinAnalysisPublisher) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async processPhoto(
    @Body(new ZodValidationPipe(PhotoProcessSchema))
    body: {
      fileKey: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const event: InitiateSkinAnalysisEvent = {
      patientId: user.id,
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
