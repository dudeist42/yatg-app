import { clientApi, TGetMovieByIdResponse } from '@/lib/clientApi/api';
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';
import { getNextPageParam, selectData, selectPaginatedData } from '../lib';

export const movieCacheKeys = {
  root: ['movie'],
  getById: (movieId: number) => [...movieCacheKeys.root, movieId],
  find: (search: string) => ['find-movie', search],
  getUserMovies: () => ['user-movies'],
};

const getMovieByIdQueryOptions = (movieId: number) =>
  queryOptions({
    queryFn: () => clientApi.movies.getById({ id: movieId }),
    queryKey: movieCacheKeys.getById(movieId),
    enabled: typeof movieId === 'number',
    select: selectData,
  });

const watchMovieMutationOptions = mutationOptions({
  mutationFn: ({ id, ...body }: { id: number; rating?: number | null }) =>
    clientApi.movies.watch({ id }, body),
  onSettled(data, error, variables, onMutateResult, context) {
    const queryKey = movieCacheKeys.getById(variables.id);
    const movieData =
      context.client.getQueryData<TGetMovieByIdResponse>(queryKey);

    if (movieData) {
      const date = new Date();
      const patchedQueryData: TGetMovieByIdResponse = {
        ...movieData,
        data: {
          ...movieData.data,
          userRating: variables.rating ?? null,
          userWatchedAt: date.toISOString(),
        },
      };
      context.client.setQueryData<TGetMovieByIdResponse>(
        queryKey,
        patchedQueryData,
      );
    }
    context.client.invalidateQueries({
      queryKey: movieCacheKeys.getUserMovies(),
    });
  },
});

const unwatchMovieMutationOptions = mutationOptions({
  mutationFn: clientApi.movies.unwatch,
  onSettled(data, error, variables, onMutateResult, context) {
    const queryKey = movieCacheKeys.getById(variables.id);
    const movieData =
      context.client.getQueryData<TGetMovieByIdResponse>(queryKey);

    if (movieData) {
      const patchedQueryData: TGetMovieByIdResponse = {
        ...movieData,
        data: {
          ...movieData.data,
          userRating: null,
          userWatchedAt: null,
        },
      };
      context.client.setQueryData<TGetMovieByIdResponse>(
        queryKey,
        patchedQueryData,
      );
    }
    context.client.invalidateQueries({
      queryKey: movieCacheKeys.getUserMovies(),
    });
  },
});

const getFindMoviesInfiniteQueryOptions = (search: string) =>
  infiniteQueryOptions({
    queryFn: ({ pageParam }: { pageParam: number }) =>
      clientApi.movies.find({ query: search, page: pageParam }),
    queryKey: movieCacheKeys.find(search),
    initialPageParam: 1,
    getNextPageParam,
    enabled: search.length > 2,
    select: selectPaginatedData,
  });

const userMoviesInfiniteQueryOptions = infiniteQueryOptions({
  queryFn: ({ pageParam }: { pageParam: number }) =>
    clientApi.movies.getUserMovies({ page: pageParam }),
  queryKey: movieCacheKeys.getUserMovies(),
  initialPageParam: 1,
  getNextPageParam,
  select: selectPaginatedData,
});

export const movieQueries = {
  find: getFindMoviesInfiniteQueryOptions,
  getById: getMovieByIdQueryOptions,
  watch: watchMovieMutationOptions,
  unwatch: unwatchMovieMutationOptions,
  getUserMovies: userMoviesInfiniteQueryOptions,
};
