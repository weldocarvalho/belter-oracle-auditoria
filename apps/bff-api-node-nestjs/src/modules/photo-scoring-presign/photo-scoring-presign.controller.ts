import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';
import type { PhotoScoringPresignRequest } from './photo-scoring-presign.contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { PhotoScoringPresignSchema } from './photo-scoring-presign.validate';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt-auth.guard';

@Controller('api/v1/photo-scoring')
export class PhotoScoringPresignController {
  constructor(
    private readonly photoScoringPresignService: PhotoScoringPresignService,
  ) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async generatePresignedUrl(
    @Body(new ZodValidationPipe(PhotoScoringPresignSchema))
    body: PhotoScoringPresignRequest,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.photoScoringPresignService.generatePresignedUrl(
      user.id,
      body.fileType,
    );
  }
}
