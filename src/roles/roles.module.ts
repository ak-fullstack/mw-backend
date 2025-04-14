import { Module } from '@nestjs/common';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role/entities/role.entity';
import { RolePermission } from './role-permission/entities/role-permission.entity';
import { RolePermissionController } from './role-permission/role-permission.controller';
import { RolePermissionService } from './role-permission/role-permission.service';

@Module({
  controllers: [RoleController,RolePermissionController],
  providers: [ RoleService,RolePermissionService],
  imports: [TypeOrmModule.forFeature([Role,RolePermission])],
})
export class RolesModule {}
