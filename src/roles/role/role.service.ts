import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { RolePermission } from '../role-permission/entities/role-permission.entity';

@Injectable()
export class RoleService {


    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
      ) {}


      private normalizePermissions(permissions: string[]): string {
        return [...permissions]
          .map(p => p.trim())
          .sort()
          .join(',');
      }
    
    
      async createRole(createRoleDto: CreateRoleDto): Promise<Role> {

        const { roleName, permissions } = createRoleDto;

        if (!permissions || permissions.length === 0) {
          throw new ConflictException('A role must have at least one permission');
        }
        
        const permissionGroup = this.normalizePermissions(permissions);
        const existing = await this.roleRepository.findOne({ where: { permissionGroup } });
        if (existing) {
          throw new ConflictException('Permission Group already exists for the role: '+existing.roleName);
        }


        return this.roleRepository.manager.transaction(async (transactionalEntityManager) => {
            // Check for duplicate role name
            const existingRole = await transactionalEntityManager.findOne(Role, {
              where: { roleName },
            });
            if (existingRole) {
              throw new ConflictException('Role name already exists');
            }
        
            // 5. Create the new role entity with permissionGroup included
            const role = this.roleRepository.create({
              roleName,
              permissionGroup,
            });
        
            // 6. Save role
            const savedRole = await transactionalEntityManager.save(Role, role);
        
            // 7. Create RolePermission entities
            const rolePermissions = permissions.map((permission) => {
              const rolePermission = new RolePermission();
              rolePermission.role = savedRole;
              rolePermission.permission = permission;
              return rolePermission;
            });
        
            // 8. Save permissions
            await transactionalEntityManager.save(RolePermission, rolePermissions);
        
            return savedRole;
          });
        }


        async getAllRolesWithPermissions(): Promise<any[]> {
            const roles = await this.roleRepository.find({
              relations: ['permissions'],
            });
            console.log(roles);
            
            return roles.map((role) => ({
              roleName: role.roleName,
              roleId:role.id,
              permissions: role.permissions.map((p) => p.permission),
            }));
          }
}
