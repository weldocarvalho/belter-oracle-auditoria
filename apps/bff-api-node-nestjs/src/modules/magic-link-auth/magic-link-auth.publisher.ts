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
  CreateUserEventRequest,
  MassTransitEnvelope,
} from './magic-link-auth.contracts';

@Injectable()
export class MagicLinkAuthPublisher implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  onModuleInit() {
    this.connection = amqp.connect([RABBITMQ_URL]);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: Channel) =>
        channel.assertExchange(RABBITMQ_EXCHANGES.createUser, 'fanout', {
          durable: true,
        }),
    });
  }

  async publishAuthRequested(data: CreateUserEventRequest): Promise<void> {
    const envelope: MassTransitEnvelope<CreateUserEventRequest> = {
      message: data,
      messageType: buildMessageType(RABBITMQ_EXCHANGES.createUser),
    };

    await this.channelWrapper.publish(
      RABBITMQ_EXCHANGES.createUser,
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
