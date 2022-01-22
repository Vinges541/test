import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [StatisticsService],
  controllers: [StatisticsController],
  imports: [DatabaseModule],
})
export class StatisticsModule {}
