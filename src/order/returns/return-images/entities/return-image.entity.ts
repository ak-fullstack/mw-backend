import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Return } from '../../entities/return.entity';
import { ReturnItem } from 'src/order/return-items/entities/return-item.entity';

@Entity()
export class ReturnImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => ReturnItem, (returnItem) => returnItem.images, {
    onDelete: 'CASCADE',
  })
  returnItem: ReturnItem;
}