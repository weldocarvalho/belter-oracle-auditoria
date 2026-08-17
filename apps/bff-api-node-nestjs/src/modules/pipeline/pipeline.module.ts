import { Module } from '@nestjs/common';
import { SkinAnalysisModule } from '../skin-analysis/skin-analysis.module';
import { PhotoPipelineController } from './photo-pipeline.controller';
import { PipelineEventsConsumer } from './pipeline-events.consumer';
import { PipelineWsGateway } from './pipeline-ws.gateway';

@Module({
  imports: [SkinAnalysisModule],
  controllers: [PhotoPipelineController],
  providers: [PipelineWsGateway, PipelineEventsConsumer],
})
export class PipelineModule {}
