import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {

    constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

 async findAll(): Promise<Supplier[]> {
  const suppliers = await this.supplierRepository.find();
  if (!suppliers || suppliers.length === 0) {
    throw new NotFoundException('No suppliers found');
  }
  return suppliers;
}

  async create(dto: CreateSupplierDto) {
    // Check if name already exists (if uniqueness is required)
    const existing = await this.supplierRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new BadRequestException(`Supplier with name "${dto.name}" already exists.`);
    }

    const supplier = this.supplierRepository.create(dto);
    return await this.supplierRepository.save(supplier);
  }



  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
