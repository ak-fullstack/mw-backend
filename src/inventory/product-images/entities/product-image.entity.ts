import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductVariant } from 'src/inventory/product-variants/entities/product-variant.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => ProductVariant, variant => variant.images, { onDelete: 'CASCADE' })
  variant: ProductVariant;
}
