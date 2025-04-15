import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { CreateGoogleCloudStorageDto } from './dto/create-google-cloud-storage.dto';
import { UpdateGoogleCloudStorageDto } from './dto/update-google-cloud-storage.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('google-cloud-storage')
export class GoogleCloudStorageController {
  constructor(private readonly googleCloudStorageService: GoogleCloudStorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { 
      limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.googleCloudStorageService.upload(file,'user-profiles');
    return { url: fileUrl }; 
  }
}
