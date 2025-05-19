import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { SizeType } from '../size-types/entities/size-type.entity';

@Module({
  controllers: [SizesController],
  providers: [SizesService],
  imports: [TypeOrmModule.forFeature([Size,SizeType])],

})
export class SizesModule { }
