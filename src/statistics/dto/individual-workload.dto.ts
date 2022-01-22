import { ApiProperty } from '@nestjs/swagger';

export class IndividualWorkloadDto {
  @ApiProperty()
  license_plate: string;

  @ApiProperty()
  average_workload: number;
}

export type IndividualWorkload = IndividualWorkloadDto;
