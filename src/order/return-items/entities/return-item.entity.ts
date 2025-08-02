import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Return } from 'src/order/returns/entities/return.entity';
import { OrderItem } from 'src/order/order-items/entities/order-item.entity';
import { ReturnItemStatus } from 'src/enum/return-items-status.enum';
import { ReturnItemCondition } from 'src/enum/return-item-condition.enum';
import { ReturnResolutionMethod } from 'src/enum/resolution-method.enum';
import { Transform } from 'class-transformer';
import { DecimalToNumber } from 'src/common/transformers/decimal-transformer';

@Entity('return_items')
export class ReturnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Return, ret => ret.items, { onDelete: 'CASCADE',nullable:false })
  @JoinColumn({ name: 'returnId' })
  returnRequest: Return;

  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'enum', enum: ReturnItemStatus, default: ReturnItemStatus.RETURN_REQUESTED })
  status: ReturnItemStatus;

  @Column({ type: 'enum', enum: ReturnItemCondition, default: null })
  itemCondition: ReturnItemCondition;

  @Column({ type: 'enum', enum: ReturnResolutionMethod, nullable: true })
  resolutionMethod: ReturnResolutionMethod;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  resolutionDate: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  originalSubtotal: number; // quantity * sp

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  discountAmount: number; // quantity * sp


  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  itemCgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  itemSgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  itemIgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  deliveryCgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  deliverySgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  deliveryIgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  totalItemTax: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  totalDeliveryTax: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  deliveryShare: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  deliveryCharge: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  totalTaxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false ,transformer:DecimalToNumber})
  totalAmount: number;

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
