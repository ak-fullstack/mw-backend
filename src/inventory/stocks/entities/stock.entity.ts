import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { StockPurchase } from 'src/inventory/stock-purchase/entities/stock-purchase.entity';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';
import { DecimalToNumber } from 'src/common/transformers/decimal-transformer';
import { StockMovement } from 'src/inventory/stock-movements/entities/stock-movement.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Column({nullable:false})
  quantity: number;

   @Column({nullable:false})
  initialDamagedQuantity: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  sp: number;

  @ManyToOne(() => StockPurchase, purchase => purchase.stocks, { onDelete: 'CASCADE' })
  purchase: StockPurchase;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, transformer: DecimalToNumber })
  igst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, name: 'discount_percent', transformer: DecimalToNumber })
  discount: number;

  @Column({ type: 'boolean', default: false })
  applyDiscount: boolean;

  @Column('decimal', { precision: 10, scale: 2, transformer: DecimalToNumber })
  ctc: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  totalTax: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  cgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  sgstAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: DecimalToNumber })
  igstAmount: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  onSale: boolean;

  @OneToMany(() => StockMovement, (movement) => movement.stock)
  stockMovements: StockMovement[];

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

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
  // get available(): number {
  //   return this.quantity - this.used - this.reserved;
  // }
}
