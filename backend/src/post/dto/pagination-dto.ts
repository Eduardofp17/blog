import { IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number;
}
