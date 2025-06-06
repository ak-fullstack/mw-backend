import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) { }

  @Get()
  async findAll() {
    return await this.productVariantsService.findAll();
  }

  @Post()
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantsService.create(createProductVariantDto);
  }

  @Post('upload-product-image-with-id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
  ) {
    return this.productVariantsService.uploadFile(file,id)
    // const fileUrl = await this.googleCloudStorageService.upload(file, 'user-profiles');

    // if (id) {
    //   await this.yourService.attachImageToEntity(Number(id), fileUrl);
    // }
    console.log(id);
    

    const fileUrl='sdfsdf'

    return { url: fileUrl };
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantsService.update(+id, updateProductVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantsService.remove(+id);
  }

  @Get('by-product/:productId')
  getVariants(@Param('productId') productId: string) {
    return this.productVariantsService.getVariantsByProduct(+productId);
  }
}
