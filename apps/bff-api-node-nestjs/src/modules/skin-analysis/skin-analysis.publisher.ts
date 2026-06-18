import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { MassTransitEnvelope, InitiateSkinAnalysisEvent } from './skin-analysis.contracts';

@Injectable()
export class SkinAnalysisPublisher implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  // OnModuleInit roda automaticamente quando o NestJS liga
  async onModuleInit() {

  this.connection = amqp.connect(['amqp://localhost:5672']);

  this.channelWrapper = this.connection.createChannel({
    json: true,
    setup: (channel: any) => {
      // AJUSTE AQUI: Nome completo da exchange esperada pelo MassTransit
      return channel.assertExchange(
        'DermePlan.Worker.Application.Models:InitiateSkinAnalysisEvent', 
        'fanout', 
        { durable: true }
      );
    },
  });
}

  async publishSubmission(data: InitiateSkinAnalysisEvent): Promise<void> {
    
  const envelope: MassTransitEnvelope<InitiateSkinAnalysisEvent> = {
    message: data,
    messageType: ['urn:message:DermePlan.Worker.Application.Models:InitiateSkinAnalysisEvent'],
  };

  // AJUSTE AQUI: Publica na Exchange correta com o prefixo do namespace
  await this.channelWrapper.publish(
    'DermePlan.Worker.Application.Models:InitiateSkinAnalysisEvent',
    '', // Sem routing key (Fanout ignora isso)
    envelope,
    { contentType: 'application/vnd.masstransit+json' } 
  );
}


  // Fecha as conexões de forma segura se o NestJS desligar (Graceful Shutdown)
  async onModuleDestroy() {
    await this.channelWrapper.close();
    await this.connection.close();
  }
}
