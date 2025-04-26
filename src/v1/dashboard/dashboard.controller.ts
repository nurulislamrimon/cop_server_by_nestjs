import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Public } from 'src/decorators/public.decorator';

@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * API: Service
   * Message: Get - statistics from snapshot and member
   */
  @Get()
  @Public()
  async getSnapshotData() {
    return await this.dashboardService.getTotalModelsCounted();
  }

  /**
   * API: Service
   * Message: Get - last month statistics with differences and member
   */
  @Get('/last-month-statistics')
  async lastMonthStatistics(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.dashboardService.lastMonthStatistics(user.id as number);
  }

  /**
   * API: Service
   * Message: Get - last year statistics with differences and member
   */
  @Get('/last-year-statistics')
  async lastYearStatistics(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.dashboardService.lastYearStatistics(user.id as number);
  }
}
