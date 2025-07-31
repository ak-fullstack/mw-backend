import { Injectable } from '@nestjs/common';
import { CreateReturnImageDto } from './dto/create-return-image.dto';
import { UpdateReturnImageDto } from './dto/update-return-image.dto';

@Injectable()
export class ReturnImagesService {
  create(createReturnImageDto: CreateReturnImageDto) {
    return 'This action adds a new returnImage';
  }

  findAll() {
    return `This action returns all returnImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returnImage`;
  }

  update(id: number, updateReturnImageDto: UpdateReturnImageDto) {
    return `This action updates a #${id} returnImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} returnImage`;
  }
}
