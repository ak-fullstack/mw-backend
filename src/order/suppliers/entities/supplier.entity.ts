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

  @Column({ length: 20, nullable: true })
  gstNumber?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockPurchase, purchase => purchase.supplier)
  stockPurchases: StockPurchase[];
}
