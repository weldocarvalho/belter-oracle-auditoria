import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SkinAnalysisModule } from '../skin-analysis/skin-analysis.module';
import { PhotoPipelineController } from './photo-pipeline.controller';
import { PipelineEventsConsumer } from './pipeline-events.consumer';
import { PipelineWsGateway } from './pipeline-ws.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    SkinAnalysisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [PhotoPipelineController],
  providers: [PipelineWsGateway, PipelineEventsConsumer, JwtAuthGuard],
})
export class PipelineModule {}
