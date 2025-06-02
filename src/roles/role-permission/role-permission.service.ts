import { Injectable } from '@nestjs/common';
import { PermissionEnum  } from 'src/enum/permissions.enum';

@Injectable()
export class RolePermissionService {

  async getAllPermissions(): Promise<{ groupedPermissions: [string, string[]][] }> {
  const groupedPermissionsMap = new Map<string, string[]>();

  const filteredPermissions = Object.values(PermissionEnum).filter(
    p => p !== 'MASTER_PERMISSION'
  );

  for (const permission of filteredPermissions) {
    const parts = permission.split('_');
    if (parts.length < 2) continue;

    const groupKey = parts[1]; // Second word as group key

    if (!groupedPermissionsMap.has(groupKey)) {
      groupedPermissionsMap.set(groupKey, []);
    }

    groupedPermissionsMap.get(groupKey)?.push(permission);
  }

  // Convert to array of entries for frontend
  return { groupedPermissions: Array.from(groupedPermissionsMap.entries()) };
}
}
