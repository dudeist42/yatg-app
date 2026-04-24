import { useCallback } from 'react';
import { useMovieQuery, useMovieSelect } from './model';
import {
  Serialized,
  TDetailedMovieEntity,
  TGetMovieByIdResponse,
} from '@yatg-app/api-types';

export const useMovieIsFetching = () => useMovieQuery().isFetching;

const selectMovieInfo = ({
  data: movie,
}: Serialized<TGetMovieByIdResponse>) => ({
  title: movie?.title,
  tagline: movie?.tagline,
  runtime: movie?.runtime,
  genres: movie?.genres,
  releaseDate: movie?.releaseDate,
});

export const useMovieInfo = () => {
  return useMovieSelect(selectMovieInfo);
};

export const useMovieField = <K extends keyof Serialized<TDetailedMovieEntity>>(
  field: K,
) =>
  useMovieSelect(
    useCallback(
      (movie: Serialized<TGetMovieByIdResponse>) => movie.data?.[field],
      [field],
    ),
  );
