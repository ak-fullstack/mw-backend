import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StockPurchase } from 'src/inventory/stock-purchase/entities/stock-purchase.entity'; 
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';

@Entity('stocks')
export class Stock {
   @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Column()
  quantity: number; 

  @Column({ default: 0 })
  used: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sp: number;

  @ManyToOne(() => StockPurchase, purchase => purchase.stocks, { onDelete: 'CASCADE' })
  purchase: StockPurchase;

  @Column('decimal', { precision: 10, scale: 2 })
  mrp: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  cgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  sgst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  igst: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0, name: 'discount_percent' })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ctc: number;  // Cost to company or cost price, nullable if not always set

  @Column({ default: 0 })
  reserved: number;

  get available(): number {
  return this.quantity - this.used - this.reserved;
}
}
