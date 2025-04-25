import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
  import { PermissionEnum  } from 'src/enum/permissions.enum'; 
  
  @Injectable()
  export class PermissionsGuard implements CanActivate { 
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );
      
      
      if (!requiredPermissions) return true;

     
  
      const { user } = context.switchToHttp().getRequest();
  
      if (!user?.permissions || user.permissions.length === 0) return false;
  
      // SUPER ADMIN shortcut
      if (user.permissions.includes(PermissionEnum.MASTER_PERMISSION)) return true;
  
      return requiredPermissions.every(p =>
        user.permissions.includes(p),
      );
    }
  }
  