import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SkinAnalysisModule } from './modules/skin-analysis/skin-analysis.module';
import { PhotoScoringPresignModule } from './modules/photo-scoring-presign/photo-scoring-presign.module';
import { MagicLinkAuthModule } from './modules/magic-link-auth/magic-link-auth.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SkinAnalysisModule,
    PhotoScoringPresignModule,
    MagicLinkAuthModule,
    PipelineModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
