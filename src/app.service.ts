import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed() {
    const carIds: string[] = (
      await this.databaseService.executeTransaction(
        `INSERT INTO hmt.car (license_plate) VALUES 
                                           ('A111AA|11'),
                                           ('B222BB|22'),
                                           ('E333EE|33'),
                                           ('M444MM|44'),
                                           ('K555KK|55') RETURNING id;`,
      )
    ).map((value) => value.id);
    await this.databaseService.executeTransaction(
      `INSERT INTO hmt.rent_session (car_id, begins_at, ends_at) VALUES 
                                    ($1, '2022-01-03'::date, '2022-01-06'::date),
                                    ($1, '2022-01-12'::date, '2022-01-27'::date),
                                                                 
                                    ($2, '2022-01-11'::date, '2022-01-14'::date),
                                    ($2, '2022-01-19'::date, '2022-01-25'::date),
                                                                 
                                    ($3, '2022-01-05'::date, '2022-01-17'::date),
                                    ($3, '2022-01-21'::date, '2022-01-24'::date),

                                    ($4, '2022-01-6'::date, '2022-01-26'::date),
                                                                 
                                    ($5, '2022-01-18'::date, '2022-01-24'::date),
                                    ($5, '2022-01-4'::date, '2022-01-10'::date);
    `,
      carIds,
    );
  }

  async clear() {
    await this.databaseService.executeTransaction(`
      DELETE FROM hmt.rent_session;
      DELETE FROM hmt.car;`);
  }
}
