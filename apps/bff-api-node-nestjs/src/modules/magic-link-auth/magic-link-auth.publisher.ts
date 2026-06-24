// magic-link-auth.publisher.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { MassTransitEnvelope, CreateUserEventRequest } from './magic-link-auth.contracts';

@Injectable()
export class MagicLinkAuthPublisher implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;

  async onModuleInit() {
    // Connects to the centralized RabbitMQ infrastructure cluster instance
    this.connection = amqp.connect([process.env.RABBITMQ_URL || 'amqp://localhost:5672']);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: any) => {
        // Declares the full fanout exchange name matching the .NET namespace target path
        return channel.assertExchange(
          'ServiceWorker.Consumers.CreateUser:CreateUserEventRequest', 
          'fanout', 
          { durable: true }
        );
      },
    });
  }

  async publishAuthRequested(data: CreateUserEventRequest): Promise<void> {
    const envelope: MassTransitEnvelope<CreateUserEventRequest> = {
      message: data,
      messageType: ['urn:message:ServiceWorker.Consumers.CreateUser:CreateUserEventRequest'],
    };

    // Publishes directly to the exchange. Fanout ignores the routing key parameter.
    await this.channelWrapper.publish(
      'ServiceWorker.Consumers.CreateUser:CreateUserEventRequest',
      '', 
      envelope,
      { contentType: 'application/vnd.masstransit+json' } 
    );
  }

  // Closes open network connections gracefully during system shutdowns
  async onModuleDestroy() {
    await this.channelWrapper.close();
    await this.connection.close();
  }
}
