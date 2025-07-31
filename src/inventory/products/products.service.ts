import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { Subcategory } from '../subcategory/entities/subcategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from '../sizes/entities/size.entity';
import { Color } from '../colors/entities/color.entity';
import { ProductImage } from '../product-images/entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>) {

  }

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validate SubCategory belongs to Category
      const subCategory = await queryRunner.manager.findOne(Subcategory, {
        where: { id: createProductDto.subCategoryId, category: { id: createProductDto.categoryId } },
        relations: ['category'],
      });

      if (!subCategory) {
        throw new BadRequestException('SubCategory does not belong to the given Category');
      }

      // 2. Create the Product
      const product = new Product();
      product.category = { id: createProductDto.categoryId } as any;
      product.subCategory = { id: createProductDto.subCategoryId } as any;
      product.name = createProductDto.productName;
      product.description = createProductDto.productDescription;
      product.has_sizes = createProductDto.hasSize;
      product.has_colors = createProductDto.hasColor;
      product.hsnCode=createProductDto.hsnCode;

      const savedProduct = await queryRunner.manager.save(Product, product);



      for (const variantDto of createProductDto.variants) {
        const variant = new ProductVariant();
        variant.sku = variantDto.sku;
        variant.product = savedProduct;

        if (createProductDto.hasColor && variantDto.color) {
          variant.color = variantDto.color;
        }
        if (createProductDto.hasSize && variantDto.size) { 
          variant.size = variantDto.size;
        }

        const savedVariant = await queryRunner.manager.save(ProductVariant, variant);

        // Save images if present
        if (variantDto.images && Array.isArray(variantDto.images)) {
          const imageEntities = variantDto.images.map((url: string) => {
            const image = new ProductImage();
            image.imageUrl = url;
            image.variant = savedVariant;
            return image;
          });

          await queryRunner.manager.save(ProductImage, imageEntities);
        }
      }


      await this.addSizesAndColorsFromVariants(savedProduct.id, createProductDto.variants, queryRunner.manager);


      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async addSizesAndColorsFromVariants(
    productId: number,
    variants: any[],
    manager: EntityManager
  ) {
    // use 'manager' instead of 'this.productRepo', 'this.sizeRepo', 'this.colorRepo'

    const colorIds = new Set<number>();
    const sizeIds = new Set<number>();

    for (const variant of variants) {
      if (variant.color?.id) colorIds.add(variant.color.id);
      if (variant.size?.id) sizeIds.add(variant.size.id);
    }

    const product = await manager.findOne(Product, {
      where: { id: productId },
      relations: ['sizes', 'colors'],
    });

    if (!product) throw new Error('Product not found');

    const existingSizeIds = new Set(product.sizes.map(s => s.id));
    const existingColorIds = new Set(product.colors.map(c => c.id));

    const newSizeIds = [...sizeIds].filter(id => !existingSizeIds.has(id));
    const newColorIds = [...colorIds].filter(id => !existingColorIds.has(id));

    const newSizes = await manager.find(Size, { where: { id: In(newSizeIds) } });
    const newColors = await manager.find(Color, { where: { id: In(newColorIds) } });

    product.sizes.push(...newSizes);
    product.colors.push(...newColors);

    return await manager.save(product);
  }


  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

}
