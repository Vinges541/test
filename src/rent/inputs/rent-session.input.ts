import { ApiProperty } from '@nestjs/swagger';
import { DateIntervalInput } from './date-interval.input';
import { IsUUID } from 'class-validator';

export class RentSessionInput extends DateIntervalInput {
  @ApiProperty()
  @IsUUID()
  carId: string;
}
