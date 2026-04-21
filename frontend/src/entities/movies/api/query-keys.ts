import { TGetMovieByIdParamsDto } from '@yatg-app/api-types';

export const moviesKeys = {
  all: () => ['movies'] as const,
  getById: (params: TGetMovieByIdParamsDto) =>
    [...moviesKeys.all(), 'getById', params] as const,
  find: (search: string) =>
    [...moviesKeys.all(), 'find', ...(search ? [search] : [])] as const,
};
