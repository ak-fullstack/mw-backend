import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { GoogleCloudStorageService } from 'src/google-cloud-storage/google-cloud-storage.service';
import { ProductImage } from '../product-images/entities/product-image.entity';

@Injectable()
export class ProductVariantsService {

  constructor(
    private readonly googleCloudStorageService: GoogleCloudStorageService,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
  ) { }

  create(createProductVariantDto: CreateProductVariantDto) {
    return 'This action adds a new productVariant';
  }

 async findAll() {
  const products = await this.productRepo.find({
    relations: [
      'variants',
      'variants.size',
      'variants.color',
      'variants.images',
    ],
    order: {
      id: 'ASC',
    },
  });

  return products.map((product) => {
    const uniqueSizes = new Map<number, any>();
    const uniqueColors = new Map<number, any>();

    const variants = product.variants.map((variant) => {
      // Collect unique sizes
      if (variant.size) {
        uniqueSizes.set(variant.size.id, variant.size);
      }
      // Collect unique colors
      if (variant.color) {
        uniqueColors.set(variant.color.id, variant.color);
      }

      return {
        id: variant.id,
        sku: variant.sku,
        size: variant.size ?? null,
        color: variant.color ?? null,
        images: variant.images,
      };
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      hasSizes: product.has_sizes,
      hasColors: product.has_colors,
      sizes: Array.from(uniqueSizes.values()),
      colors: Array.from(uniqueColors.values()),
      variants,
    };
  });
}

async getVariantsByProduct(productId: number): Promise<ProductVariant[]> {
  return this.variantRepo.find({
    where: {
      product: { id: productId },
    },
    relations: ['color', 'size', 'images'],
  });
}

async uploadFile(file: Express.Multer.File, variantId?: string) {
  const fileUrl = await this.googleCloudStorageService.upload(file, 'product-images');

  if (variantId) {
    const variant = await this.variantRepo.findOne({ where: { id: Number(variantId) } });
    if (!variant) {
      throw new NotFoundException(`No variant found with ID ${variantId}`);
    }

    const productImage = this.productImageRepo.create({
      imageUrl: fileUrl,
      variant: variant,
    });

    await this.productImageRepo.save(productImage);

    return {
      url: fileUrl,
      message: 'Image uploaded and linked to variant',
    };
  }

  return {
    url: fileUrl,
    message: 'Image uploaded without variant association',
  };
}

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    return `This action updates a #${id} productVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariant`; 
  }
}
