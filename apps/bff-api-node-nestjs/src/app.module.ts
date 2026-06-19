// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SkinAnalysisModule } from './modules/skin-analysis/skin-analysis.module';
import { PhotoScoringPresignModule } from './modules/photo-scoring-presign/photo-scoring-presign.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true, 
        envFilePath: '.env',
      }),
    SkinAnalysisModule,
    PhotoScoringPresignModule
  ], 
  controllers: [
    AppController    // Mantém o controller de Healthcheck ativo na raiz
  ],
  providers: [],     // Deixamos vazio já que limpamos o AppService padrão do Nest
})

export class AppModule {}
