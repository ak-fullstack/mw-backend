import { Controller, Get, UseGuards} from '@nestjs/common';
import { EodClosureService } from './eod-closure.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';

@Controller('eod-closure')
export class EodClosureController {
  constructor(private readonly eodClosureService: EodClosureService) { }

  @Get('report')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_REPORTS)
  async getEodReport() {
    return await this.eodClosureService.generateEodReport();
  }
}
