import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';
import { SizeType } from '../size-types/entities/size-type.entity';

@Injectable()
export class SizesService {
constructor(
    @InjectRepository(Size)
    private readonly sizeRepo: Repository<Size>,

    @InjectRepository(SizeType)
    private readonly sizeTypeRepo: Repository<SizeType>
  ) {}

  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    const sizeType = await this.sizeTypeRepo.findOne({ where: { id: createSizeDto.typeId } });

    if (!sizeType) {
      throw new NotFoundException('Size type not found');
    }

    const size = this.sizeRepo.create({
      label: createSizeDto.label,
      description: createSizeDto.description,
      type: sizeType,
    });

    return this.sizeRepo.save(size);
  }

  async findAll(): Promise<Size[]> {
    const sizes = await this.sizeRepo.find({ relations: ['type'] });

    if (!sizes.length) {
      throw new NotFoundException('No sizes found');
    }

    return sizes;
  }

  async findOne(id: number): Promise<Size> {
    const size = await this.sizeRepo.findOne({
      where: { id },
      relations: ['type'],
    });

    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    return size;
  }

  async update(id: number, updateSizeDto: UpdateSizeDto): Promise<Size> {
    const size = await this.sizeRepo.findOne({ where: { id }, relations: ['type'] });

    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    if (updateSizeDto.typeId) {
      const type = await this.sizeTypeRepo.findOne({ where: { id: updateSizeDto.typeId } });
      if (!type) throw new NotFoundException('Size type not found');
      size.type = type;
    }

    if (updateSizeDto.label !== undefined) {
      size.label = updateSizeDto.label;
    }

    if (updateSizeDto.description !== undefined) {
      size.description = updateSizeDto.description;
    }

    return this.sizeRepo.save(size);
  }

  async remove(id: number): Promise<void> {
    const size = await this.sizeRepo.findOne({ where: { id } });

    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }

    await this.sizeRepo.remove(size);
  }


  async findBySizeTypeId(typeId: number): Promise<Size[]> {
  const sizeType = await this.sizeTypeRepo.findOne({ where: { id: typeId } });

  if (!sizeType) {
    throw new NotFoundException(`SizeType with ID ${typeId} not found`);
  }

  const sizes = await this.sizeRepo.find({
    where: { type: { id: typeId } },
    relations: ['type'],
  });

  if (!sizes.length) {
    throw new NotFoundException(`No sizes found for SizeType ID ${typeId}`);
  }

  return sizes;
}
}
