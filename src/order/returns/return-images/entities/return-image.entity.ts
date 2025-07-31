import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Return } from '../../entities/return.entity';

@Entity()
export class ReturnImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Return, (returnEntity) => returnEntity.images, {
    onDelete: 'CASCADE',
  })
  return: Return;
}