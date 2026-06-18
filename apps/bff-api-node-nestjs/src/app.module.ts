// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SkinAnalysisModule } from './modules/skin-analysis/skin-analysis.module';

@Module({
  imports: [
    SkinAnalysisModule // Importa o módulo do SkinAnalysis para ativar suas rotas e injeções
  ], 
  controllers: [
    AppController    // Mantém o controller de Healthcheck ativo na raiz
  ],
  providers: [],     // Deixamos vazio já que limpamos o AppService padrão do Nest
})

export class AppModule {}
