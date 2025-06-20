import { Injectable } from '@nestjs/common';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';

@Injectable()
export class ReturnItemsService {
  create(createReturnItemDto: CreateReturnItemDto) {
    return 'This action adds a new returnItem';
  }

  findAll() {
    return `This action returns all returnItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returnItem`;
  }

  update(id: number, updateReturnItemDto: UpdateReturnItemDto) {
    return `This action updates a #${id} returnItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} returnItem`;
  }
}
