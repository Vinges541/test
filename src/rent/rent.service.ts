import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RentSession } from './dto/rent-session.dto';

@Injectable()
export class RentService {
  private readonly baseRate = 1000;
  private readonly steps = new Map([
    [17, 0.85],
    [9, 0.9],
    [4, 0.95],
    [0, 1],
  ]);
  private readonly daysBetweenSessions = 3;
  readonly carIsUnavailable = 'car is unavailable';

  constructor(private readonly databaseService: DatabaseService) {}

  calculateCost(days: number) {
    let cost = 0;
    for (const [step, modifier] of this.steps) {
      const stepDaysCount = days - step;
      if (stepDaysCount > 0) {
        cost += this.baseRate * modifier * stepDaysCount;
        days -= stepDaysCount;
      }
    }
    return cost;
  }

  async isCarAvailable(
    carId: string,
    beginsAt: Date,
    endsAt: Date,
  ): Promise<boolean> {
    return (
      await this.databaseService.executeQuery(
        `
        SELECT EXISTS(SELECT TRUE FROM hmt.car WHERE id = $1) 
                   AND 
               NOT EXISTS (SELECT TRUE FROM hmt.rent_session 
               WHERE car_id = $1 
                 AND 
                     ($2, $3) OVERLAPS (
                                             begins_at - ${
                                               this.daysBetweenSessions
                                             }, 
                                             ends_at + ${
                                               this.daysBetweenSessions + 1
                                             })) as available`,
        [carId, beginsAt, endsAt],
      )
    )[0].available;
  }

  async createSession(
    carId: string,
    beginsAt: Date,
    endsAt: Date,
  ): Promise<RentSession> {
    if (!(await this.isCarAvailable(carId, beginsAt, endsAt))) {
      throw new Error(this.carIsUnavailable);
    }
    return (
      await this.databaseService.executeTransaction(
        `
        INSERT INTO hmt.rent_session (car_id, begins_at, ends_at) 
        VALUES ($1, $2, $3) RETURNING id`,
        [carId, beginsAt, endsAt],
      )
    )[0];
  }
}
