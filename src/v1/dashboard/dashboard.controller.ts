import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async findAll() {
    return await this.dashboardService.getAllData();
  }
}
