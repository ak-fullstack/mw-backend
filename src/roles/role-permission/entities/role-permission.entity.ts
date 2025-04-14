import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Role } from 'src/roles/role/entities/role.entity';


@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;  // The role to which this permission belongs

  @Column({
    type: 'varchar',
    length: 255, // You can set a max length here
  })
  permission: string;
}
