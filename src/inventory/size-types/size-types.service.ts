import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeTypeDto } from './dto/create-size-type.dto';
import { UpdateSizeTypeDto } from './dto/update-size-type.dto';
import { SizeType } from './entities/size-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SizeTypesService {
  constructor(
    @InjectRepository(SizeType)
    private readonly sizeTypeRepo: Repository<SizeType>,
  ) {}

  async create(createDto: CreateSizeTypeDto): Promise<SizeType> {
    const sizeType = this.sizeTypeRepo.create(createDto);
    return this.sizeTypeRepo.save(sizeType);
  }

async findAll(): Promise<SizeType[]> {
  const sizeTypes = await this.sizeTypeRepo.find({ relations: ['sizes'] });

  if (sizeTypes.length === 0) {
    throw new NotFoundException('No size types found');
  }

  return sizeTypes;
}

  async findOne(id: number): Promise<SizeType> {
    const sizeType = await this.sizeTypeRepo.findOne({
      where: { id },
      relations: ['sizes'],
    });
    if (!sizeType) throw new NotFoundException(`SizeType with ID ${id} not found`);
    return sizeType;
  }

  async update(id: number, updateDto: UpdateSizeTypeDto): Promise<SizeType> {
    const sizeType = await this.findOne(id);
    const updated = Object.assign(sizeType, updateDto);
    return this.sizeTypeRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.sizeTypeRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`SizeType with ID ${id} not found`);
  }
}
