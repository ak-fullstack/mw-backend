import { Color } from "src/inventory/colors/entities/color.entity";
import { ProductImage } from "src/inventory/product-images/entities/product-image.entity";
import { Product } from "src/inventory/products/entities/product.entity";
import { Size } from "src/inventory/sizes/entities/size.entity";
import { Stock } from "src/inventory/stocks/entities/stock.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('product_variants')
@Unique(['product', 'color', 'size'])
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => Color, { nullable: true })
    color: Color;

    @ManyToOne(() => Size, { nullable: true })
    size: Size;

    @Column({ unique: true })
    sku: string;

    @OneToMany(() => ProductImage, image => image.variant, { cascade: false })
    images: ProductImage[];

    @OneToMany(() => Stock, stock => stock.productVariant)
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
