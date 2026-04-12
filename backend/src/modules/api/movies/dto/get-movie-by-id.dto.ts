import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetMovieByIdParamsDto {
  @Type(() => Number)
  @IsInt()
  id!: number;
}
