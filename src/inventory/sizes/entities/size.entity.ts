import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, Unique } from 'typeorm';
import { SizeType } from 'src/inventory/size-types/entities/size-type.entity';
import { Product } from 'src/inventory/products/entities/product.entity';

@Entity({ name: 'sizes' })
@Unique(['label', 'type']) // Enforce uniqueness of label per sizeType
export class Size {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    label: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @ManyToOne(() => SizeType, sizeType => sizeType.sizes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'type_id' })
    type: SizeType;

    @ManyToMany(() => Product, (product) => product.sizes)
    products: Product[];

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
