import { Module } from '@nestjs/common';
import { SizeTypesService } from './size-types.service';
import { SizeTypesController } from './size-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeType } from './entities/size-type.entity';

@Module({
  controllers: [SizeTypesController],
  providers: [SizeTypesService],
  imports: [TypeOrmModule.forFeature([SizeType])],

})
export class SizeTypesModule { }
