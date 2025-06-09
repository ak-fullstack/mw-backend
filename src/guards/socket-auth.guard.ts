import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,private configService:ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractToken(client);
    
    if (!token) {
      throw new WsException('Missing auth token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'sample',
      });
      // You can attach user info to client for later use
      client.user = { userId: payload.sub, email: payload.email, role: payload.role, permissions: payload.permissions };
      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }

 private extractToken(client: any): string | null {
  const cookieHeader = client.handshake.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith('access_token=')) {
      return cookie.split('=')[1];
    }
  }
  return null;
}

}
