import { Injectable } from '@nestjs/common';
import { Permission } from 'src/enum/permissions.enum';

@Injectable()
export class RolePermissionService {

    async getAllPermissions(): Promise<{ permissions: string[] }> {
        return {
          permissions: Object.values(Permission),
        };
      }
}
