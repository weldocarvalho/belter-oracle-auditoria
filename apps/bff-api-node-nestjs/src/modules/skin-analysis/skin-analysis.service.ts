import { Injectable } from '@nestjs/common';
import { SkinAnalysisPublisher } from './skin-analysis.publisher';
import { InitiateSkinAnalysisEvent } from './skin-analysis.contracts';

@Injectable()
export class SkinAnalysisService {
  // Injeta o nosso publicador de RabbitMQ de forma nativa via construtor (igualzinho ao C#)
  constructor(private readonly publisher: SkinAnalysisPublisher) {}

  async processSkinAnalysisSubmission(dto: InitiateSkinAnalysisEvent) {
    // PASSO 1: Aqui futuramente entrará a chamada do Drizzle ORM para salvar no PostgreSQL:
    // await this.db.insert(wizardSubmissions).values({...})
    console.log(`[SkinAnalysisService] Salvando respostas do usuário ${dto.patientId} no banco...`);

    // PASSO 2: Envia o evento para a fila do RabbitMQ
    console.log(`[SkinAnalysisService] Despachando evento para o Worker .NET processar via IA...`);
    await this.publisher.publishSubmission(dto);

    return {
      success: true,
      status: 'PROCESSING',
      message: 'Questionário recebido! Nossa IA está analisando sua pele.'
    };
  }
}
