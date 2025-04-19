import { Injectable } from '@nestjs/common';
import { PermissionEnum  } from 'src/enum/permissions.enum';

@Injectable()
export class RolePermissionService {

  async getAllPermissions(): Promise<{ permissions: string[] }> {
    return {
      permissions: Object.values(PermissionEnum).filter(p => p !== 'MASTER_PERMISSION'),
    };
  }
}
