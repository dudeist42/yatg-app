import { TGetMovieByIdParamsDto } from '@yatg-app/api-types';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetMovieByIdParamsDto implements TGetMovieByIdParamsDto {
  @Type(() => Number)
  @IsInt()
  id!: number;
}
