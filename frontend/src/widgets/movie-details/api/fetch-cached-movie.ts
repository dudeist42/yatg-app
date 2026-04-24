import { moviesApi } from '@/entities/movies';
import { cache } from 'react';

export const fetchCachedMovieById = cache(async (movieId: number) =>
  moviesApi.getById({ id: movieId }),
);
