import { Body, ConflictException, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { permission } from 'process';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) { }


  @Post('create-role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('CREATE_ROLE')
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.roleService.createRole(createRoleDto);
      return {
        message: 'Role created successfully',
        data: newRole,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Role already exists');
      }
      throw error;
    }
  }


  @Get('get-all-roles-with-permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('READ_ROLE')
  async getAllRoles() {
    return await this.roleService.getAllRolesWithPermissions();
  }

  @Delete('delete-role/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('DELETE_ROLE')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
