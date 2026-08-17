import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SkinAnalysisService } from './skin-analysis.service';
import type { InitiateSkinAnalysisEvent } from './skin-analysis.contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { InitiateSkinAnalysisSchema } from './skin-analysis.validate';

@Controller('initiate-skin-analysis')
export class SkinAnalysisController {
  constructor(private readonly wizardService: SkinAnalysisService) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitSkinAnalysis(
    @Body(new ZodValidationPipe(InitiateSkinAnalysisSchema))
    body: InitiateSkinAnalysisEvent,
  ) {
    return await this.wizardService.processSkinAnalysisSubmission(body);
  }
}
