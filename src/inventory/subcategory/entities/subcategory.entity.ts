import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Category } from 'src/inventory/category/entities/category.entity'; 
import { Product } from 'src/inventory/products/entities/product.entity'; 

@Entity('subcategories')
@Unique(['name', 'category']) 
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @ManyToOne(() => Category, category => category.subcategories, { onDelete: 'CASCADE',nullable: false })
  category: Category;

  @OneToMany(() => Product, product => product.subcategory)
  products: Product[];
}
