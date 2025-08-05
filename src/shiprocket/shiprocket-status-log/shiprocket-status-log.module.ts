import { Module } from '@nestjs/common';
import { ShiprocketStatusLogService } from './shiprocket-status-log.service';
import { ShiprocketStatusLogController } from './shiprocket-status-log.controller';
import { ShiprocketStatusLog } from './entities/shiprocket-status-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ShiprocketStatusLogController],
  providers: [ShiprocketStatusLogService],
    imports:[TypeOrmModule.forFeature([ShiprocketStatusLog])],
    exports: [ShiprocketStatusLogService],
  
})
export class ShiprocketStatusLogModule {}
