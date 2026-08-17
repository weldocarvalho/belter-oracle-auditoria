import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

@Injectable()
@WebSocketGateway()
export class PipelineWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly clients = new Map<string, Set<WebSocket>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: WebSocket, request: IncomingMessage) {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const token = url.searchParams.get('token');
    const userId = token ? this.resolveUserId(token) : null;

    if (!userId) {
      client.close();
      return;
    }

    const userClients = this.clients.get(userId) ?? new Set<WebSocket>();
    userClients.add(client);
    this.clients.set(userId, userClients);

    client.on('close', () => {
      userClients.delete(client);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    client.close();
  }

  broadcastToUser(userId: string, event: string, payload: unknown): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) {
      return;
    }

    const data = JSON.stringify({ event, payload });
    for (const client of userClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  private resolveUserId(token: string): string | null {
    try {
      const payload = this.jwtService.verify<{ sub?: string }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
}
