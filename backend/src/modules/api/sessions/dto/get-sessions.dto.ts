import { TGetSessionsQueryDto } from '@yatg-app/api-types';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetSessionsQueryDto implements TGetSessionsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20;
}
