import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UnwatchMovieParamsDto {
  @Type(() => Number)
  @IsInt()
  id!: number;
}
