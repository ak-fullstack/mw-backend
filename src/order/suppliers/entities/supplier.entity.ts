import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { StockPurchase } from 'src/inventory/stock-purchase/entities/stock-purchase.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 15, nullable: true })
  phone?: string;

  @Column({ length: 20,unique: true, nullable: true })
  gstNumber?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

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

  @OneToMany(() => StockPurchase, purchase => purchase.supplier)
  stockPurchases: StockPurchase[];
}
