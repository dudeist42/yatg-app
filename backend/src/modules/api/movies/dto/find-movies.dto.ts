import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TFindMoviesQueryDto } from '@yatg-app/api-types';

export class FindMoviesQueryDto implements TFindMoviesQueryDto {
  @IsString()
  query!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
