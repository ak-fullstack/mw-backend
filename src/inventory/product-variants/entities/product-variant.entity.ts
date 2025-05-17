import { Color } from "src/inventory/colors/entities/color.entity";
import { ProductImage } from "src/inventory/product-images/entities/product-image.entity";
import { Product } from "src/inventory/products/entities/product.entity";
import { Size } from "src/inventory/sizes/entities/size.entity";
import { Stock } from "src/inventory/stocks/entities/stock.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => Color)
    color: Color;

    @ManyToOne(() => Size)
    size: Size;

    @Column({ unique: true })
    customId: string;

    @OneToMany(() => ProductImage, image => image.variant, { cascade: true })
    images: ProductImage[];

    @OneToMany(() => Stock, stock => stock.productVariant)
    stocks: Stock[];
}
