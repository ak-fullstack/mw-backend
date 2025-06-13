import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from 'src/inventory/category/entities/category.entity';
import { Subcategory } from 'src/inventory/subcategory/entities/subcategory.entity';
import { Color } from 'src/inventory/colors/entities/color.entity';
import { Size } from 'src/inventory/sizes/entities/size.entity';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL', nullable: true })
  category: Category;

  @ManyToOne(() => Subcategory, subcategory => subcategory.products, { onDelete: 'SET NULL', nullable: true })
  subCategory: Subcategory;

  @Column({ type: 'varchar', length: 20, nullable: true })
  hsnCode: string;

  @Column({ default: false })
  has_sizes: boolean;

  @Column({ default: false })
  has_colors: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Color, (color) => color.products)
  @JoinTable({
    name: 'product_colors',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' }
  })
  colors: Color[];


  @ManyToMany(() => Size, (size) => size.products)
  @JoinTable({
    name: 'product_sizes',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'size_id', referencedColumnName: 'id' },
  })
  sizes: Size[];

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];
}
