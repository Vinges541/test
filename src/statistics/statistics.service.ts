import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { IndividualWorkload } from './dto/individual-workload.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getIndividualWorkloads(month: Date): Promise<IndividualWorkload[]> {
    return this.databaseService.executeQuery(
      'select * from hmt.get_average_workload($1)',
      [month],
    );
  }

  getTotalWorkload(individualWorkloads: IndividualWorkload[]) {
    const average = (arr: IndividualWorkload[]) =>
      arr.reduce((p, c) => p + c.average_workload, 0) / arr.length;

    return average(individualWorkloads);
  }
}
