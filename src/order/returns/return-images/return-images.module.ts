import { Module } from '@nestjs/common';
import { ReturnImagesService } from './return-images.service';
import { ReturnImagesController } from './return-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnImage } from './entities/return-image.entity';

@Module({
  controllers: [ReturnImagesController],
  providers: [ReturnImagesService],
  imports:[TypeOrmModule.forFeature([ReturnImage])]
})
export class ReturnImagesModule {}
