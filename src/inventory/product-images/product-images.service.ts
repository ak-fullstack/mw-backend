import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { Repository } from 'typeorm';
import { GoogleCloudStorageService } from 'src/google-cloud-storage/google-cloud-storage.service';

@Injectable()
export class ProductImagesService {

    constructor(
        @InjectRepository(ProductImage)
        private readonly imageRepo: Repository<ProductImage>,
        private readonly gcloudStorageService: GoogleCloudStorageService
    ) { }

    async setPrimary(imageId: number) {
        const image = await this.imageRepo.findOne({
            where: { id: imageId },
            relations: ['variant'],
        });

        if (!image) throw new NotFoundException('Image not found');

        // Set all images of this variant to non-primary
        await this.imageRepo.update(
            { variant: { id: image.variant.id } },
            { isPrimary: false }
        );

        image.isPrimary = true;
        return this.imageRepo.save(image);
    }


    async deleteImage(id: any): Promise<boolean> {
        const image = await this.imageRepo.findOne({ where: { id } });

        if (!image) {
            throw new Error('Image not found');
        }

        await this.gcloudStorageService.delete(image.imageUrl);
        const result = await this.imageRepo.delete(id);
        return !!result.affected && result.affected > 0;
    }

}
