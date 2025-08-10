import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sample',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [SocketsGateway, SocketsService],
  exports:[SocketsGateway]
})
export class SocketsModule {}
