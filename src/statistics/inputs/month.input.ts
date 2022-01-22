import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class MonthInput {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  month: Date;
}
