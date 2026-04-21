import { TGetUserMoviesQueryDto } from '@yatg-app/api-types';

export const userMoviesKeys = {
  all: () => ['user-movies'] as const,
  getAll: (query?: Omit<TGetUserMoviesQueryDto, 'page'>) =>
    [...userMoviesKeys.all(), 'get-all', ...(query ? [query] : [])] as const,
};
