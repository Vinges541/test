import { ApiProperty } from '@nestjs/swagger';

export class RentSessionDto {
  @ApiProperty()
  id: string;
}

export type RentSession = RentSessionDto;
