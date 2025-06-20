import { Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class StockMovementsService {

    constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,
  ) {}

 async createMovements(
  movements: CreateStockMovementDto[],
  manager?: EntityManager,
): Promise<StockMovement[]> {
  const repo = manager ? manager.getRepository(StockMovement) : this.stockMovementRepo;
  const created = repo.create(movements);
  return await repo.save(created);
}
}
