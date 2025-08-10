// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private redisService: RedisService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const storedToken = await this.redisService.getToken(user.userId, 'customer');

    if (!storedToken) {
      throw new UnauthorizedException('Unauthorized');
    }


    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }



    if (!user || !user.role) {
      throw new ForbiddenException('Unauthenticated access.');

    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Unauthorized access');
    }

    return true;
  }
}
