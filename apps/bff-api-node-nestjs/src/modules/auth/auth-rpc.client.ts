import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
import { AuthenticateRequest, AuthenticateResult } from './auth.contracts';

interface PendingRequest {
  resolve: (result: AuthenticateResult) => void;
  reject: (reason: Error) => void;
  timer: NodeJS.Timeout;
}

@Injectable()
export class AuthRpcClient implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channelWrapper!: ChannelWrapper;
  private readonly pending = new Map<string, PendingRequest>();

  onModuleInit() {
    this.connection = amqp.connect([RABBITMQ_URL]);

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: Channel) =>
        Promise.all([
          channel.assertExchange(RABBITMQ_EXCHANGES.authenticate, 'fanout', {
            durable: true,
          }),
          channel.assertExchange(
            RABBITMQ_EXCHANGES.authenticateResult,
            'fanout',
            {
              durable: true,
            },
          ),
        ]).then(() =>
          channel
            .assertQueue('bff.auth.results', { durable: true })
            .then((queue) =>
              channel
                .bindQueue(
                  queue.queue,
                  RABBITMQ_EXCHANGES.authenticateResult,
                  '',
                )
                .then(() =>
                  channel.consume(
                    queue.queue,
                    (message) => {
                      if (!message) {
                        return;
                      }
                      this.handleResult(message);
                    },
                    { noAck: false },
                  ),
                ),
            ),
        ),
    });
  }

  async authenticate(
    payload: Omit<AuthenticateRequest, 'correlationId' | 'requestedAt'>,
  ): Promise<AuthenticateResult> {
    const correlationId = randomUUID();
    const envelope = {
      message: {
        ...payload,
        correlationId,
        requestedAt: new Date().toISOString(),
      },
      messageType: buildMessageType(RABBITMQ_EXCHANGES.authenticate),
    };

    const result = new Promise<AuthenticateResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(correlationId);
        reject(
          new Error('Timeout aguardando resposta do worker de autenticação.'),
        );
      }, 15000);

      this.pending.set(correlationId, { resolve, reject, timer });
    });

    await this.channelWrapper.publish(
      RABBITMQ_EXCHANGES.authenticate,
      '',
      envelope,
      { contentType: MASS_TRANSIT_CONTENT_TYPE },
    );

    return result;
  }

  private handleResult(message: import('amqplib').ConsumeMessage) {
    try {
      const raw = JSON.parse(message.content.toString()) as {
        message?: AuthenticateResult;
      };
      const result = raw?.message;

      if (!result || typeof result.correlationId !== 'string') {
        this.channelWrapper.ack(message);
        return;
      }

      const pendingRequest = this.pending.get(result.correlationId);
      if (pendingRequest) {
        clearTimeout(pendingRequest.timer);
        this.pending.delete(result.correlationId);
        pendingRequest.resolve(result);
      }

      this.channelWrapper.ack(message);
    } catch {
      this.channelWrapper.nack(message, false, true);
    }
  }

  async onModuleDestroy() {
    for (const pendingRequest of this.pending.values()) {
      clearTimeout(pendingRequest.timer);
      pendingRequest.reject(new Error('AuthRpcClient encerrado.'));
    }
    this.pending.clear();

    await this.channelWrapper.close();
    await this.connection.close();
  }
}
