import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {

  }

  @Patch('set-primary/:id')
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @RequirePermissions(PermissionEnum.UPDATE_PRODUCT_IMAGE)
  async setPrimaryImage(@Param('id') imageId: number) {
    return this.productImagesService.setPrimary(imageId);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @RequirePermissions(PermissionEnum.UPDATE_PRODUCT_IMAGE)
  async deleteIage(@Param('id') imageId: number) {
    return this.productImagesService.deleteImage(imageId);
  }
}
