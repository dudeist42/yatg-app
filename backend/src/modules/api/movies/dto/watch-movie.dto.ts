import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class WatchMovieParamsDto {
  @Type(() => Number)
  @IsInt()
  id!: number;
}

export class WatchMovieBodyDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
