import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_URL,
} from '../../shared/rabbitmq/rabbitmq.constants';
import {
  PipelineEnvelope,
  SkinAnalysisCompletedEvent,
} from './pipeline.contracts';
import { PipelineWsGateway } from './pipeline-ws.gateway';

@Injectable()
export class PipelineEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PipelineEventsConsumer.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private retryTimer: NodeJS.Timeout | null = null;
  private stopping = false;

  constructor(private readonly gateway: PipelineWsGateway) {}

  onModuleInit() {
    this.connect().catch(() => this.scheduleRetry());
  }

  private async connect() {
    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();

    const exchange = RABBITMQ_EXCHANGES.skinAnalysisCompleted;
    await this.channel.assertExchange(exchange, 'fanout', {
      durable: true,
    });
    const queue = await this.channel.assertQueue('bff.pipeline.completed', {
      durable: true,
      exclusive: false,
    });
    await this.channel.bindQueue(queue.queue, exchange, '');

    await this.channel.consume(
      queue.queue,
      (message) => {
        if (!message) {
          return;
        }
        this.handleMessage(message);
      },
      { noAck: false },
    );

    this.logger.log(`Escutando conclusões do pipeline na exchange ${exchange}`);
  }

  private handleMessage(message: ConsumeMessage) {
    try {
      const envelope = this.parseEnvelope(message);
      const payload = envelope.message;
      const patientId = payload.patientId;

      this.gateway.broadcastToUser(
        patientId,
        'skin.analysis.completed',
        payload,
      );

      this.channel?.ack(message);
    } catch (error) {
      this.logger.error(
        'Falha ao processar evento de conclusão do pipeline',
        error as Error,
      );
      this.channel?.nack(message, false, false);
    }
  }

  private parseEnvelope(
    message: ConsumeMessage,
  ): PipelineEnvelope<SkinAnalysisCompletedEvent> {
    const raw = JSON.parse(
      message.content.toString(),
    ) as PipelineEnvelope<SkinAnalysisCompletedEvent>;
    const payload = raw?.message;

    if (!payload || typeof payload.patientId !== 'string') {
      throw new Error('Evento de conclusão sem patientId válido.');
    }

    return {
      message: payload,
      messageType: Array.isArray(raw.messageType)
        ? raw.messageType.map((item) => String(item))
        : [],
    };
  }

  private scheduleRetry() {
    if (this.stopping) {
      return;
    }
    this.retryTimer = setTimeout(() => {
      this.connect().catch(() => this.scheduleRetry());
    }, 5000);
  }

  async onModuleDestroy() {
    this.stopping = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    try {
      await this.channel?.close();
    } catch {
      void 0;
    }
    try {
      await this.connection?.close();
    } catch {
      void 0;
    }
  }
}
