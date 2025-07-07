import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/roles/role/entities/role.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { StockStage } from 'src/enum/stock-stages.enum';
import { ReturnStatus } from 'src/enum/return-status.enum';
import { ReturnItemStatus } from 'src/enum/return-items-status.enum';
import { VerifyReturnItemsDto } from './dto/verify-return-items-dto';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) { }

  @Get('get-all-returns')
  async getAllReturns() {
    return await this.returnsService.getAllReturns();
  }

  @Get('waiting-approval')
async getWaitingApprovalReturns() {
  return this.returnsService.getWaitingApprovalReturns();
}

  @Post('request-return')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FAM_MEMBER')
  async createReturn(@Req() req, @Body() createReturnDto: CreateReturnDto) {
    const customerId = req.user?.userId; // assuming JWT has user.id
    return this.returnsService.create(createReturnDto, customerId);
  }

  @Get('get-return-by-id/:id')
  async getReturnById(@Param('id') id: number) {
    return await this.returnsService.getReturnById(id);
  }

  @Patch('move-to-return_intransit')
    moveFromRequestedToIntransit(@Body() updateOrderStausDto: UpdateReturnStatusDto) {
      return this.returnsService.updateReturnStatus(updateOrderStausDto, StockStage.DELIVERED, StockStage.IN_TRANSIT_TO_SELLER,ReturnStatus.RETURN_REQUESTED, ReturnStatus.RETURN_IN_TRANSIT,ReturnItemStatus.RETURN_IN_TRANSIT);
    }

    @Patch('move-to-return_received')
    moveFromIntransitToReceived(@Body() updateOrderStausDto: UpdateReturnStatusDto) {
      return this.returnsService.updateReturnStatus(updateOrderStausDto, StockStage.IN_TRANSIT_TO_SELLER, StockStage.RETURNED,ReturnStatus.RETURN_IN_TRANSIT, ReturnStatus.RETURN_RECEIVED,ReturnItemStatus.RETURN_RECEIVED);
    }

    @Post('move-to-approval')
verifyReturnItems(@Body() body: VerifyReturnItemsDto) {
  return this.returnsService.verifyAndMoveItems(body);
}


}
