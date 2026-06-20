import { Module } from '@nestjs/common';
import { PhotoScoringPresignController } from './photo-scoring-presign.controller';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PhotoScoringPresignController],
  providers: [PhotoScoringPresignService],
  imports: [ConfigModule]
})

export class PhotoScoringPresignModule {}
