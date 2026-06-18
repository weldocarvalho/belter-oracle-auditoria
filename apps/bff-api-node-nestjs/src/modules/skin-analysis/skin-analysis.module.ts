import { Module } from '@nestjs/common';
import { SkinAnalysisController } from './skin-analysis.controller';
import { SkinAnalysisService } from './skin-analysis.service';
import { SkinAnalysisPublisher } from './skin-analysis.publisher';

@Module({
  controllers: [SkinAnalysisController],
  providers: [SkinAnalysisService, SkinAnalysisPublisher],
})

export class SkinAnalysisModule {}
