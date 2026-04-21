import type { TPaginatedResponse } from "../shared/generic.response";
import type { TUserMovieEntity } from "../shared/entities/user-movie.entity";

export type TGetUserMoviesQueryDto = {
  page?: number;
  limit?: number;
}

export type TGetUserMoviesResponse = TPaginatedResponse<TUserMovieEntity>