import { Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}


    @Post('create-role')
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
async getAllRoles() {
    throw new ConflictException('Role already exists');

  return await this.roleService.getAllRolesWithPermissions();
}
}
