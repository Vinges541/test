import { ApiProperty } from '@nestjs/swagger';
import { IndividualWorkloadDto } from './individual-workload.dto';

export class TotalWorkloadDto {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => IndividualWorkloadDto, isArray: true })
  individual: IndividualWorkloadDto[];
}
