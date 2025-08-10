import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderGateway } from './order.gateway';
import { SocketAuthGuard } from 'src/guards/socket-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sample',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [OrderGateway, SocketAuthGuard],
  // exports: [SocketAuthGuard], 
})
export class SocketModule {}