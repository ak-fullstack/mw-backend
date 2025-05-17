import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const color = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(color);
  }

  async findAll(): Promise<Color[]> {
    const colors = await this.colorRepository.find();
    if (colors.length === 0) {
      throw new NotFoundException('No colors found');
    }
    return colors;
  }

  async findOne(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = await this.findOne(id);
    Object.assign(color, updateColorDto);
    return await this.colorRepository.save(color);
  }

  async remove(id: number): Promise<void> {
    const color = await this.findOne(id);
    await this.colorRepository.remove(color);
  }
}
