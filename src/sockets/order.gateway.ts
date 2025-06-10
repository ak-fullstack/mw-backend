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
import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  namespace: '/order',
})
@Injectable()
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService, private configService: ConfigService) { }

  // ✅ Map to store sockets per user
  private userSockets = new Map<string, Set<Socket>>();

  async handleConnection(client: Socket) {
    const token = this.extractBearerToken(client);
    console.log(`Attempting connection for client: ${client.id}`);

    if (!token) {
      console.warn(`Client ${client.id}: Missing auth token. Disconnecting.`);
      client.emit('unauthorized', 'Missing auth token');
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'sample',
      });

      const userId = payload.sub;

      client.data.user = {
        userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      };
      console.log(`Client ${client.id} authenticated. User ID: ${userId}`);

      // ✅ ADDED LOGIC HERE: Add the client socket to the userSockets map
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set<Socket>()); // Create a new Set if user ID doesn't exist
      }
      this.userSockets.get(userId)!.add(client); // Add the current client socket to the Set for this user

      // console.log(`Client ${client.id} added to userSockets for user ${userId}. Total sockets for user: ${this.userSockets.get(userId)?.size}`);

    } catch (err) {
      console.error(`Client ${client.id}: Invalid auth token. Error: ${err.message}. Disconnecting.`);
      client.emit('unauthorized', 'Invalid auth token');
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnecting');
    
    const userId = client.data?.user?.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
      console.log(`Client disconnected: ${client.id} for user ${userId}`);
    }
  }

  private extractBearerToken(client: Socket): string | null {
    const authHeader = client.handshake.headers['authorization'];
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }

  @SubscribeMessage('order_qr_scanned')
  handleQrScanned(@MessageBody() data: { orderId: string }, @ConnectedSocket() client: Socket) {


    const currentUserId = client.data.user?.userId;
    console.log('current user id : ' + currentUserId);
        console.log('current socket id : ' + client.id);


    if (!currentUserId) return;

    const sockets = this.userSockets.get(currentUserId);

    if (!sockets) return;

    // ✅ Emit only to other devices (not the one that scanned)
    for (const socket of sockets) {
      console.log('available ' + socket.id);
      if (socket.id !== client.id) {
        console.log('sent to ' + socket.id);
        socket.emit('order_id', {
          orderId: data.orderId,
        });
      }
    }

  }
}
