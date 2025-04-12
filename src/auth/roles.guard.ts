import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';  // Import your JWT Auth guard
import { ROLES_KEY } from './roles.decorator';  // Import the roles metadata key
import { Role } from './roles.enum';  // Import Role enum
import { PUBLIC_KEY } from './public.decorator';  // Import the Public decorator's metadata key

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    // ✅ Call parent guard to validate and attach user to request
    const canProceed = await super.canActivate(context);
    if (!canProceed) return false;

    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new UnauthorizedException('No roles specified, access denied');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // This will now be defined
    console.log(user);
    

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('You do not have the required role(s)');
  }
}
