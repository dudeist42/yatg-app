import { TDeleteUserMovieParamsDto } from '@yatg-app/api-types';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DeleteUserMovieParamsDto implements TDeleteUserMovieParamsDto {
  @Type(() => Number)
  @IsInt()
  movieId!: number;
}
