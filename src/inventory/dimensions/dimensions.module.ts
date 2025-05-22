import { Module } from '@nestjs/common';
import { DimensionsService } from './dimensions.service';
import { DimensionsController } from './dimensions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dimension } from './entities/dimension.entity';

@Module({
  controllers: [DimensionsController],
  providers: [DimensionsService],
  imports: [TypeOrmModule.forFeature([Dimension])], 

})
export class DimensionsModule { }
