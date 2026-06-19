import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';
import type { PhotoScoringPresignRequest } from './photo-scoring-presign.contracts';

@Controller('api/v1/photo-scoring') // BASE http://localhost:3333/api/v1/photo-scoring
export class PhotoScoringPresignController {
  constructor(private readonly photoScoringPresignService: PhotoScoringPresignService) {}

  @Post('presigned-url') // POST http://localhost:3333/api/v1/photo-scoring/presigned-url
  @HttpCode(HttpStatus.OK)

  async generatePresignedUrl(@Body() body: PhotoScoringPresignRequest) {
    console.log('Received request for presigned URL with patientId:', body.patientId);
    return await this.photoScoringPresignService.generatePresignedUrl(body.patientId, body.fileType);
  }
}
