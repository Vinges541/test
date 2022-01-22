import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBiggerThan } from '../validators/is-bigger-than.validator';
import { IsIntervalLessThan30Days } from '../validators/is-interval-less-than.validator';
import { IsNotWeekend } from '../validators/is-not-weekend.validator';

export class DateIntervalInput {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotWeekend('beginsAt', { message: 'must be not weekend' })
  beginsAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotWeekend('endsAt', { message: 'must be not weekend' })
  @IsBiggerThan('beginsAt', {
    message: 'endsAt must be later than beginsAt',
  })
  @IsIntervalLessThan30Days('beginsAt', {
    message: 'number of days between dates must not exceed 30 days',
  })
  endsAt: Date;
}
