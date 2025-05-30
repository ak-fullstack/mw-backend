import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
    imports: [TypeOrmModule.forFeature([Supplier])], // ✅ Register entity

})
export class SuppliersModule {}
