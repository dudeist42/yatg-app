import { infiniteQueryOptions, mutationOptions } from '@tanstack/react-query';
import {
  Serialized,
  TGetMovieByIdResponse,
  TGetUserMoviesQueryDto,
  TUpsertUserMovieBodyDto,
  TUpsertUserMovieParamsDto,
} from '@yatg-app/api-types';
import {
  getNextPageParam,
  selectPaginatedData,
} from '@/shared/lib/query-utils';
import { moviesKeys } from '@/entities/movies';
import { deleteWatched, getAll, upsertWatched } from './api';
import { userMoviesKeys } from './query-keys';

export const getAllInfiniteQueryOptions = (
  params?: Omit<TGetUserMoviesQueryDto, 'page'>,
) =>
  infiniteQueryOptions({
    queryFn: ({ pageParam: page }: { pageParam: number }) =>
      getAll({ limit: params?.limit, page }),
    queryKey: userMoviesKeys.getAll(params),
    initialPageParam: 1,
    getNextPageParam,
    select: selectPaginatedData,
  });

export const upsertWatchedMutation = mutationOptions({
  mutationFn: ({
    params,
    body,
  }: {
    params: TUpsertUserMovieParamsDto;
    body?: TUpsertUserMovieBodyDto;
  }) => upsertWatched(params, body),
  onMutate(variables, context) {
    const queryKey = moviesKeys.getById({ id: variables.params.movieId });

    const previousData =
      context.client.getQueryData<Serialized<TGetMovieByIdResponse>>(queryKey);

    if (previousData) {
      context.client.setQueryData<Serialized<TGetMovieByIdResponse>>(queryKey, {
        ...previousData,
        data: {
          ...previousData.data,
          userRating: variables.body?.rating ?? null,
          userWatchedAt: new Date().toISOString(),
        },
      });
    }

    return { previousData, queryKey };
  },
  onError(error, variables, onMutateResult, context) {
    if (onMutateResult?.previousData) {
      context.client.setQueryData(
        onMutateResult.queryKey,
        onMutateResult.previousData,
      );
    }
  },
  onSettled(data, error, variables, onMutateResult, context) {
    context.client.invalidateQueries({
      queryKey: userMoviesKeys.getAll(),
    });
  },
});

export const deleteWatchedMutation = mutationOptions({
  mutationFn: deleteWatched,
  onMutate(variables, context) {
    const queryKey = moviesKeys.getById({ id: variables.movieId });

    const previousData =
      context.client.getQueryData<Serialized<TGetMovieByIdResponse>>(queryKey);

    if (previousData) {
      context.client.setQueryData<Serialized<TGetMovieByIdResponse>>(queryKey, {
        ...previousData,
        data: {
          ...previousData.data,
          userRating: null,
          userWatchedAt: null,
        },
      });
    }

    return { previousData, queryKey };
  },
  onError(error, variables, onMutateResult, context) {
    if (onMutateResult?.previousData) {
      context.client.setQueryData(
        onMutateResult.queryKey,
        onMutateResult.previousData,
      );
    }
  },
  onSettled(data, error, variables, onMutateResult, context) {
    context.client.invalidateQueries({
      queryKey: userMoviesKeys.getAll(),
    });
  },
});
