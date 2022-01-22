import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async onModuleInit() {
    await this.pool.query(`
    CREATE SCHEMA IF NOT EXISTS hmt;
    
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE IF NOT EXISTS hmt.car
    (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        license_plate TEXT
    );
    
    CREATE TABLE IF NOT EXISTS hmt.rent_session
    (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        car_id    UUID REFERENCES hmt.car (id),
        begins_at DATE NOT NULL,
        ends_at   DATE NOT NULL
    );
    
    create or replace function hmt.get_first_day_of_month(month date)
        returns date
    as
    $$
    select date_trunc('month', month);
    $$
        language sql immutable;
    
    create or replace function hmt.get_last_day_of_month(month date)
        returns date
    as
    $$
    select date_trunc('month', month) + interval '1 month - 1 day';
    $$
        language sql immutable;
    
    
    create or replace function hmt.get_days_count_in_month(month date)
        returns double precision
    as
    $$
    select extract(days from hmt.get_last_day_of_month(month));
    $$
        language sql immutable;
    
    create or replace function hmt.get_days_count_in_range(range daterange)
        returns integer
    as
    $$
    
    select case range != 'empty' and upper(range) - lower(range) is not null
               when true
                   then upper(range) - lower(range)
               else
                   0
               end;
    $$
        language sql immutable;
    
    create or replace function hmt.get_average_workload(month date)
        returns table
                (
                    license_plate    text,
                    average_workload double precision
                )
    as
    $$
    select license_plate,
           sum(case begins_at is not null and ends_at is not null
                   when true
                       then hmt.get_days_count_in_range(
                               daterange(begins_at, ends_at, '[]') *
                               daterange(hmt.get_first_day_of_month(month), 
                               hmt.get_last_day_of_month(month), '[]'))
                   else 0
               end) /
           hmt.get_days_count_in_month(month) as average_workload
    from hmt.car
             left join hmt.rent_session rs on car.id = rs.car_id
    group by license_plate;
    $$
        language sql STABLE;`);
  }

  async executeQuery(queryText: string, values?: any[]): Promise<any[]> {
    const result = await this.pool.query(queryText, values);
    return result.rows;
  }

  async executeTransaction(queryText: string, values?: any[]): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(queryText, values);
      await client.query('COMMIT');
      return result.rows;
    } catch (e) {
      await client.query('ROLLBACK');
      this.logger.error(e);
      throw e;
    } finally {
      client.release();
    }
  }
}
