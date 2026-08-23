import type { TResponse } from "../../shared/generic.response";
import type { TDetailedMovieEntity } from "../../shared/entities/detailed-movie.entity";

export type TGetMovieByIdParamsDto = {
  id: number;
}

export type TGetMovieByIdResponse = TResponse<TDetailedMovieEntity>