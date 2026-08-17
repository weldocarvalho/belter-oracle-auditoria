import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';
import type { PhotoScoringPresignRequest } from './photo-scoring-presign.contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { PhotoScoringPresignSchema } from './photo-scoring-presign.validate';

@Controller('api/v1/photo-scoring')
export class PhotoScoringPresignController {
  constructor(
    private readonly photoScoringPresignService: PhotoScoringPresignService,
  ) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  async generatePresignedUrl(
    @Body(new ZodValidationPipe(PhotoScoringPresignSchema))
    body: PhotoScoringPresignRequest,
  ) {
    return await this.photoScoringPresignService.generatePresignedUrl(
      body.patientId,
      body.fileType,
    );
  }
}
