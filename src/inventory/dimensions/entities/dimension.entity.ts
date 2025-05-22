import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from 'src/inventory/products/entities/product.entity';

@Entity({ name: 'dimensions' })
export class Dimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  unit?: string;  // e.g., "cm", "inch"

  // @ManyToMany(() => Product, (product) => product.dimensions)
  // products: Product[];
}
