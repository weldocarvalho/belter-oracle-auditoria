import { Module } from '@nestjs/common';
import { PhotoScoringPresignController } from './photo-scoring-presign.controller';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';

@Module({
  controllers: [PhotoScoringPresignController],
  providers: [PhotoScoringPresignService],
})

export class PhotoScoringPresignModule {}
