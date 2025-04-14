import { Controller, Get } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service'; // Import the service

@Controller('role-permission')
export class RolePermissionController {

    constructor(private readonly RolePermissionService: RolePermissionService) { } // Inject the service

    @Get('get-all-permissions')
    async getAllPermissions(): Promise<any> {
        return this.RolePermissionService.getAllPermissions()  // Get all roles from the enum
    }
    
}
