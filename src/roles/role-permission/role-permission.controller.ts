import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service'; // Import the service
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('role-permission')
export class RolePermissionController {

    constructor(private readonly RolePermissionService: RolePermissionService) { } // Inject the service

    @Get('get-all-permissions')
    @UseGuards(JwtAuthGuard,PermissionsGuard)
    @RequirePermissions('READ_PERMISSION')
    async getAllPermissions(): Promise<any> {
        return this.RolePermissionService.getAllPermissions()  // Get all roles from the enum
    }
    
}
