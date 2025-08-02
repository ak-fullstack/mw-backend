import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Order } from 'src/order/orders/entities/order.entity';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';
import { GstType } from 'src/enum/gst-types.enum';
import { StockMovement } from 'src/inventory/stock-movements/entities/stock-movement.entity';
import { Transform } from 'class-transformer';
import { WalletTransaction } from 'src/customer/wallet-transaction/entities/wallet-transaction.entity';
import { DecimalToNumber } from 'src/common/transformers/decimal-transformer';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, {
    onDelete: 'CASCADE', eager: true
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

  @Column('decimal', { precision: 10, scale: 2 ,transformer:DecimalToNumber})
  sp: number; // selling price at the time of order

  @Column('decimal', { precision: 10, scale: 2,transformer:DecimalToNumber })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 ,transformer:DecimalToNumber})
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0,transformer:DecimalToNumber })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0,transformer:DecimalToNumber })
  igst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 ,transformer:DecimalToNumber})
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 ,transformer:DecimalToNumber})
  ctc: number;



  @Column({
    type: 'enum',
    enum: GstType,
    nullable: false,
  })
  gstType: GstType;


  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  originalSubtotal: number; // quantity * sp

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  discountAmount: number; // quantity * sp

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  itemCgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  itemSgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  itemIgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliveryCgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliverySgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliveryIgstAmount: number;


  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  itemTaxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliveryTaxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliveryShare: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  deliveryCharge: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false,transformer:DecimalToNumber })
  totalTaxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer:DecimalToNumber })
  totalAmount: number;

  @OneToMany(() => StockMovement, (movement) => movement.orderItem)
  stockMovements: StockMovement[];

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
