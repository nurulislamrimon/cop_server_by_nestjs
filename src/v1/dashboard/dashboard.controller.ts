import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  async getSnapshotData() {
    return await this.dashboardService.getTotalModelsCounted();
  }

  @Get('/last-year-statistics')
  async lastYearStatistics(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.dashboardService.lastYearStatistics(user.id);
  }
}
