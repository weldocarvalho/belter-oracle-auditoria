import { Injectable } from '@nestjs/common';
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

  handleConnection(client: WebSocket, request: IncomingMessage) {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const userId = url.searchParams.get('userId');

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
}
