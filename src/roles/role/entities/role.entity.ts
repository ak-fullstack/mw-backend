import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from 'src/roles/role-permission/entities/role-permission.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roleName: string; // More specific naming to indicate it's a role name

  @Column({ unique: true })
  permissionGroup: string; 

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
    cascade: true,
    eager: true, // 🔥 This must be set
  })  
  permissions: RolePermission[]; // Relation with RolePermission table

  @OneToMany(() => User, (user) => user.role)
    users: User[];
}