import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from './messaging.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/messaging',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagingService: MessagingService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token) as { sub: string };
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: Socket) {
    // cleanup handled by socket.io rooms automatically
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const senderId = client.data.userId as string | undefined;
    if (!senderId) return;

    try {
      const message = await this.messagingService.sendMessage(
        data.conversationId,
        senderId,
        data.content,
      );

      // Emit to sender's room (other tabs / devices)
      this.server.to(`user:${senderId}`).emit('new_message', message);

      // Fetch conversation to find recipient
      const conversations = await this.messagingService.getConversations(senderId);
      const conv = conversations.find((c: any) => c._id.toString() === data.conversationId);
      if (conv) {
        const recipientId = this.messagingService.getRecipientId(
          conv as any,
          senderId,
        );
        if (recipientId) {
          this.server.to(`user:${recipientId}`).emit('new_message', message);
        }
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
