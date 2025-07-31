import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Stock } from 'src/inventory/stocks/entities/stock.entity';
import { GstType } from 'src/enum/gst-types.enum';
import { Supplier } from 'src/order/suppliers/entities/supplier.entity';



@Entity('stock_purchases')
export class  StockPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billRefNo: string;

   @Column('decimal', { precision: 10, scale: 2 })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalTax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', nullable: true })
  invoicePdfUrl?: string;

 @ManyToOne(() => Supplier, supplier => supplier.stockPurchases)
  supplier: Supplier;

  @Column({ type: 'timestamp' })
  purchaseDate: Date;

   @Column({
    type: 'enum',
    enum: GstType,
  })
  gstType: GstType;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => Stock, stock => stock.purchase)
  stocks: Stock[];

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
