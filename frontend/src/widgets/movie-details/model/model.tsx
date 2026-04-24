'use client';
import { moviesQueries } from '@/entities/movies';
import { useQuery } from '@tanstack/react-query';
import { Serialized, TGetMovieByIdResponse } from '@yatg-app/api-types';
import { createContext, ReactNode, useContext } from 'react';

const MovieIdContext = createContext<number | null>(null);

export const useMovieId = () => useContext(MovieIdContext);

export const useMovieQuery = () => {
  const movieId = useMovieId();

  return useQuery({
    ...moviesQueries.getByIdQueryOptions({ id: movieId! }),
    enabled: !!movieId,
  });
};

export const useMovieSelect = <R = Serialized<TGetMovieByIdResponse>,>(
  select?: (source: Serialized<TGetMovieByIdResponse>) => R,
) => {
  const movieId = useMovieId();

  const { data: movie } = useQuery({
    ...moviesQueries.getByIdQueryOptions({ id: movieId! }),
    enabled: !!movieId,
    select,
  });

  return movie;
};

export const MovieProvider = ({
  children,
  movieId,
}: {
  children: ReactNode;
  movieId: number | null;
}) => {
  return <MovieIdContext value={movieId}>{children}</MovieIdContext>;
};
