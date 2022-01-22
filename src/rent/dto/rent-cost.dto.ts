import { ApiProperty } from '@nestjs/swagger';

export class RentCostDto {
  @ApiProperty()
  cost: number;
}
