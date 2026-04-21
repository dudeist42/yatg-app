import { client } from '@/shared/lib/api-client/api-client';
import {
  Serialized,
  TFindMoviesQueryDto,
  TFindMoviesResponse,
  TGetMovieByIdParamsDto,
  TGetMovieByIdResponse,
} from '@yatg-app/api-types';

export const find = (query: TFindMoviesQueryDto) =>
  client
    .get<Serialized<TFindMoviesResponse>>('/movies', {
      params: query,
    })
    .then((r) => r.data);

export const getById = (params: TGetMovieByIdParamsDto) =>
  client
    .get<Serialized<TGetMovieByIdResponse>>(`/movies/${params.id}`)
    .then((r) => r.data);
