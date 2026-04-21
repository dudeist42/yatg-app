import { client } from '@/shared/lib/api-client/api-client';
import {
  Serialized,
  TDeleteUserMovieParamsDto,
  TGetUserMoviesQueryDto,
  TGetUserMoviesResponse,
  TUpsertUserMovieBodyDto,
  TUpsertUserMovieParamsDto,
} from '@yatg-app/api-types';

export const upsertWatched = (
  params: TUpsertUserMovieParamsDto,
  body?: TUpsertUserMovieBodyDto,
) =>
  client.post<void>(`/user-movies/${params.movieId}`, body).then((r) => r.data);

export const deleteWatched = (params: TDeleteUserMovieParamsDto) =>
  client.delete<void>(`/user-movies/${params.movieId}`).then((r) => r.data);

export const getAll = (query: TGetUserMoviesQueryDto) =>
  client
    .get<Serialized<TGetUserMoviesResponse>>('/user-movies', { params: query })
    .then((r) => r.data);
