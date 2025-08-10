import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Role } from 'src/roles/role/entities/role.entity';
import { PermissionEnum } from 'src/enum/permissions.enum';


@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;  // The role to which this permission belongs

  @Column({
  type: 'enum',
  enum: PermissionEnum,
  })
  permission: PermissionEnum;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
