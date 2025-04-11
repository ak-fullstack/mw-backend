import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';  // Import your JWT Auth guard
import { ROLES_KEY } from './roles.decorator';  // Import the roles metadata key
import { Role } from './roles.enum';  // Import Role enum
import { PUBLIC_KEY } from './public.decorator';  // Import the Public decorator's metadata key

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();  // Call the parent class constructor (JwtAuthGuard)
  }

  // This is where we implement the canActivate method
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;  // If the route is public, allow access
    }

    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    // If no roles are specified, return Unauthorized
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new UnauthorizedException('No roles specified, access denied');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    // Check if the user has at least one of the required roles
    if (requiredRoles.some(role => user.roles?.includes(role))) {
      return true;
    }

    // If the user doesn't have the required roles, throw ForbiddenException
    throw new ForbiddenException('You do not have the required role(s)');
  }
}
