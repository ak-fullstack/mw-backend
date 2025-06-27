import { Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { StockStage } from 'src/enum/stock-stages.enum';
import { Stock } from '../stocks/entities/stock.entity';

@Injectable()
export class StockMovementsService {

  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
  ) { }

  async createMovements(
    movements: CreateStockMovementDto[],
    manager?: EntityManager,
  ): Promise<StockMovement[]> {
    const repo = manager ? manager.getRepository(StockMovement) : this.stockMovementRepo;

    const created = movements.map(m => {
      const { stockId, orderId, orderItemId, ...rest } = m;
      return repo.create({
        ...rest,
        stock: { id: stockId },
        order: orderId ? { id: orderId } : undefined,
        orderItem: orderItemId ? { id: orderItemId } : undefined,
      });
    });

    return await repo.save(created);
  }


  async getNetStockStageQuantities(): Promise<any> {
    try {
      const result = await this.stockMovementRepo.query(`
  SELECT 
    combined.stock_id AS stockId,
    combined.stage,
    SUM(combined.net_quantity) AS totalQuantity,
    s.quantity AS stockQuantity
  FROM (
    -- Add quantity where items moved TO a stage
    SELECT 
      stockId AS stock_id,
      \`to\` AS stage,
      quantity AS net_quantity
    FROM stock_movements

    UNION ALL

    -- Subtract quantity where items moved FROM a stage
    SELECT 
      stockId AS stock_id,
      \`from\` AS stage,
      -quantity AS net_quantity
    FROM stock_movements
  ) AS combined
  INNER JOIN stocks s ON s.id = combined.stock_id
  GROUP BY combined.stock_id, combined.stage, s.quantity
  HAVING SUM(combined.net_quantity) > 0;
`);


      console.log(result);

      const grouped: Record<number, { stockId: number; stockQuantity: number; stages: Record<string, number> }> = {};
      const stockIds = new Set<number>();

      for (const row of result) {
        const stockId = Number(row.stockId);
        const stage = row.stage;
        const quantity = Number(row.totalQuantity);

        stockIds.add(stockId);

        if (!grouped[stockId]) {
          grouped[stockId] = {
            stockId,
            stockQuantity: Number(row.stockQuantity),
            stages: {},
          };
        }

        grouped[stockId].stages[stage] = quantity;
      }

      // 2. Load stocks with productVariant and product
      const stocks = await this.stockRepo.find({
        where: { id: In([...stockIds]) },
        relations: ['productVariant', 'productVariant.product'],
      });

      // 3. Enrich the result
      const final = Object.values(grouped).map(item => {
        const stock = stocks.find(s => s.id === item.stockId);
        return {
          ...item,
          productVariant: stock?.productVariant || null,
          product: stock?.productVariant?.product || null,
        };
      });

      return final;
    } catch (error) {
      console.error('Error in getStockStageQuantities:', error);
      throw new Error('Failed to fetch stock stage quantities');
    }
  }

  async getNetQuantityForStockAndStage(stockId: number, stage: StockStage): Promise<number> {
  const result = await this.stockMovementRepo.query(
    `
    SELECT SUM(combined.net_quantity) AS totalQuantity
    FROM (
      -- INCOMING (to the stage)
      SELECT quantity AS net_quantity
      FROM stock_movements
      WHERE stockId = ? AND \`to\` = ?

      UNION ALL

      -- OUTGOING (from the stage)
      SELECT -quantity AS net_quantity
      FROM stock_movements
      WHERE stockId = ? AND \`from\` = ?
    ) AS combined
  `,
    [stockId, stage, stockId, stage]
  );

  return Number(result[0]?.totalQuantity ?? 0);
}





}
