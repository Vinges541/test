import { Body, Controller, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiResponse } from '@nestjs/swagger';
import { TotalWorkloadDto } from './dto/total-workload.dto';
import { MonthInput } from './inputs/month.input';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Post('report')
  @ApiResponse({ type: TotalWorkloadDto })
  async getReport(@Body() monthInput: MonthInput): Promise<TotalWorkloadDto> {
    const individualWorkloads =
      await this.statisticsService.getIndividualWorkloads(monthInput.month);
    return {
      total: this.statisticsService.getTotalWorkload(individualWorkloads),
      individual: individualWorkloads,
    };
  }
}
