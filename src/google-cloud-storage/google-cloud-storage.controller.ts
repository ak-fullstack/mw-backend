import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { CreateGoogleCloudStorageDto } from './dto/create-google-cloud-storage.dto';
import { UpdateGoogleCloudStorageDto } from './dto/update-google-cloud-storage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/enum/roles.enum';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';

@Controller('google-cloud-storage')
export class GoogleCloudStorageController {
  constructor(private readonly googleCloudStorageService: GoogleCloudStorageService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.googleCloudStorageService.upload(file, 'user-profiles');
    return { url: fileUrl };
  }

  @Post('upload-return-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
      },
    }),
  )
  async uploadReturnImage(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.googleCloudStorageService.upload(file, 'return-images');
    return { url: fileUrl };
  }
}
