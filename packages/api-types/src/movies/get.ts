import type { TPaginatedResponse } from "../shared/generic.response";
import type { TMovieEntity } from "../shared/entities/movie.entity";

export type TFindMoviesQueryDto = {
  query: string;
  page?: number;
}

export type TFindMoviesResponse = TPaginatedResponse<TMovieEntity>