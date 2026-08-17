import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import amqp, {
  AmqpConnectionManager,
  Channel,
  ChannelWrapper,
} from 'amqp-connection-manager';
import {
  buildMessageType,
  MASS_TRANSIT_CONTENT_TYPE,
  RABBITMQ_EXCHANGES,
  RABBITMQ_URL,
} from '../../shared/rabbitmq/rabbitmq.constants';
import {
  InitiateSkinAnalysisEvent,
  MassTransitEnvelope,
} from './skin-analysis.contracts';

@Injectable()
export class SkinAnalysisPublisher implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  onModuleInit() {
    this.connection = amqp.connect([RABBITMQ_URL]);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: Channel) =>
        channel.assertExchange(
          RABBITMQ_EXCHANGES.initiateSkinAnalysis,
          'fanout',
          { durable: true },
        ),
    });
  }

  async publishSubmission(data: InitiateSkinAnalysisEvent): Promise<void> {
    const envelope: MassTransitEnvelope<InitiateSkinAnalysisEvent> = {
      message: data,
      messageType: buildMessageType(RABBITMQ_EXCHANGES.initiateSkinAnalysis),
    };

    await this.channelWrapper.publish(
      RABBITMQ_EXCHANGES.initiateSkinAnalysis,
      '',
      envelope,
      { contentType: MASS_TRANSIT_CONTENT_TYPE },
    );
  }

  async onModuleDestroy() {
    await this.channelWrapper.close();
    await this.connection.close();
  }
}
