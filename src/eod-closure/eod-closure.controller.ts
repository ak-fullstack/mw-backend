import { Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { EodClosureService } from './eod-closure.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { EodReportDto } from './dto/eod-report.dto';
import { CreateEodClosureDto } from './dto/create-eod-closure.dto';

@Controller('eod-closure')
export class EodClosureController {
  constructor(private readonly eodClosureService: EodClosureService) { }

  @Post('report')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_REPORTS)
  async getEodReport(@Body() getEodReportDto: EodReportDto) {
    return await this.eodClosureService.generateEodReport(getEodReportDto.date);
  }

  @Get('create-closure')
async createClosure() {
  return this.eodClosureService.createClosure();
}
}
