import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Order } from 'src/order/orders/entities/order.entity';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';
import { GstType } from 'src/enum/gst-types.enum';
import { StockMovement } from 'src/inventory/stock-movements/entities/stock-movement.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, {
  onDelete: 'CASCADE',eager: true
})
@JoinColumn({ name: 'orderId' }) // 👈 custom FK column name
order: Order;

  @ManyToOne(() => ProductVariant, { eager: true })
  productVariant: ProductVariant;

  @ManyToOne(() => Stock, { eager: true })
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sp: number; // selling price at the time of order

  @Column('decimal', { precision: 10, scale: 2 })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  igst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ctc: number;

  @Column({ type: 'int', nullable: true })
  returnQuantity: number;

  @Column({ type: 'text', nullable: true })
  returnReason: string;

  @Column({
    type: 'enum',
    enum: GstType,
    nullable: false,
  })
  gstType: GstType;

  @Column({ nullable: true })
  refundedAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subTotal: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  cgstAmount: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  sgstAmount: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  igstAmount: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @OneToMany(() => StockMovement, (movement) => movement.orderItem)
  stockMovements: StockMovement[];
}
