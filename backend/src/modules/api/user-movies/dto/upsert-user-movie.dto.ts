import {
  TUpsertUserMovieBodyDto,
  TUpsertUserMovieParamsDto,
} from '@yatg-app/api-types';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpsertUserMovieParamsDto implements TUpsertUserMovieParamsDto {
  @Type(() => Number)
  @IsInt()
  movieId!: number;
}

export class UpsertUserMovieBodyDto implements TUpsertUserMovieBodyDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number | null;
}
