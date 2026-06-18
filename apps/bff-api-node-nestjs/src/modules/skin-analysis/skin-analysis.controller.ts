import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SkinAnalysisService } from './skin-analysis.service';
import type { InitiateSkinAnalysisEvent } from './skin-analysis.contracts';
//import { InitiateSkinAnalysisEvent } from './skin-wizard.contracts';


@Controller('initiate-skin-analysis') // Rota base: http://localhost:3000/initiate-skin-analysis
export class SkinAnalysisController {
  constructor(private readonly wizardService: SkinAnalysisService) {}

  @Post('submit') // Sub-rota: POST http://localhost:3000/initiate-skin-analysis/submit
  @HttpCode(HttpStatus.OK) // Retorna HTTP 200 ao invés do padrão 201 do Nest

  async submitSkinAnalysis(@Body() body: InitiateSkinAnalysisEvent) {
    // O @Body joga o JSON recebido direto na variável 'body'
    return await this.wizardService.processSkinAnalysisSubmission(body);
  }
}
