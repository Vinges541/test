import { ApiProperty } from '@nestjs/swagger';

export class CarAvailabilityDto {
  @ApiProperty()
  available: boolean;
}
