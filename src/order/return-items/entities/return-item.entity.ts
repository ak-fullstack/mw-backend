import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Return } from 'src/order/returns/entities/return.entity'; 
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';

@Entity('return_items')
export class ReturnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Return, ret => ret.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'returnId' })
  returnRequest: Return;

  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'], default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
}
