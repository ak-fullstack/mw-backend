import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';


@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  namespace: '/order',
})
export class SocketsGateway {

  @WebSocketServer() server: Server;


  constructor(private readonly socketsService: SocketsService, private readonly jwtService: JwtService, private configService: ConfigService, private redisService: RedisService) { }

  afterInit() {
    this.server.use(async (socket, next) => {
      try {
        const token = this.extractBearerToken(socket);

        if (!token) {
          return next(new Error('Authentication error: Token missing'));
        }

        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        socket.data.user = {
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
        };

        next();
      } catch (error) {
        socket.disconnect(true);
        next(new Error('Authentication error: ' + error.message));
      }
    });
  }


  async handleConnection(socketClient: Socket) {
    const userData = socketClient.data.user;
    this.redisService.addSocketClient(userData.userId, socketClient.id)

  }

  async handleDisconnect(socketClient: Socket) {
    const userData = socketClient.data.user;
    this.redisService.removeSocketClient(userData.userId, socketClient.id)
  }



  private extractBearerToken(client: Socket): string | null {
    const authHeader = client.handshake.headers['authorization'];
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }


  @SubscribeMessage('order_qr_scanned')
  async handleQrScanned(@MessageBody() data: { orderId: string }, @ConnectedSocket() socketClient: Socket) {
    const currentUser = socketClient.data.user;
    if (!currentUser.userId) return;

    const socketIds = await this.redisService.getSocketClients(currentUser.userId);
    if (!socketIds) return;

    for (const socketId of socketIds) {
      if (socketId !== socketClient.id) {
        this.server.to(socketId).emit('order_id', { orderId: data.orderId });
      }
    }
  }

  notifyNewOrder(orderId: number) {
    console.log('asdad');
    
      this.server.emit('new_order', { orderId });       
  }

}
