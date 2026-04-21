import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { find, getById } from './api';
import {
  getNextPageParam,
  selectData,
  selectPaginatedData,
} from '@/shared/lib/query-utils';
import {
  TFindMoviesQueryDto,
  TGetMovieByIdParamsDto,
} from '@yatg-app/api-types';
import { moviesKeys } from './query-keys';

export const findInfiniteQueryOptions = ({
  query,
}: Omit<TFindMoviesQueryDto, 'page'>) =>
  infiniteQueryOptions({
    queryFn: ({ pageParam: page }: { pageParam: number }) =>
      find({ query, page }),
    queryKey: moviesKeys.find(query),
    initialPageParam: 1,
    getNextPageParam,
    enabled: query.trimStart().length > 1,
    select: selectPaginatedData,
  });

export const getByIdQueryOptions = (params: TGetMovieByIdParamsDto) =>
  queryOptions({
    queryFn: () => getById(params),
    queryKey: moviesKeys.getById(params),
    select: selectData,
  });
