import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Size } from 'src/inventory/sizes/entities/size.entity';

@Entity({ name: 'size_types' })
export class SizeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @OneToMany(() => Size, size => size.type)
  sizes: Size[];

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

