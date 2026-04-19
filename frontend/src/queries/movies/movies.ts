import {
  clientApi,
  TFindMovieResponse,
  TGetMovieByIdResponse,
} from '@/lib/clientApi/api';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

export const movieCacheKeys = {
  root: ['movie'],
  getById: (movieId: number) => [...movieCacheKeys.root, movieId],
  find: (search: string) => ['find-movie', search],
};

export const getMovieByIdQueryOptions = (movieId: number) => ({
  queryFn: () => clientApi.movies.getById({ id: movieId }),
  queryKey: movieCacheKeys.getById(movieId),
});

export const getWatchMovieMutationOptions = () => {};

export const useMovieByIdQuery = (movieId?: number | null) => {
  const query = useQuery({
    ...getMovieByIdQueryOptions(movieId!),
    enabled: typeof movieId === 'number',
    select(data) {
      return data.data;
    },
  });

  return query;
};

export const useWatchMovieMutation = () => {
  const mutation = useMutation({
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
    },
  });

  return mutation;
};

export const useUnwatchMovieMutation = () => {
  const mutation = useMutation({
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
    },
  });

  return mutation;
};

export const selectSearchMoviesData = (
  data: InfiniteData<TFindMovieResponse, number>,
) => {
  return data.pages.map((page) => page.data).flat();
};

export const getSearchMovieNextPageParam = (response: TFindMovieResponse) => {
  const nextPage = response.meta.page + 1;

  return nextPage > response.meta.totalPages ? null : nextPage;
};

export const getSearchMovieInfinityQueryOptions = (search: string) => ({
  queryFn: ({ pageParam }: { pageParam: number }) =>
    clientApi.movies.find({ query: search, page: pageParam }),
  queryKey: movieCacheKeys.find(search),
  initialPageParam: 1,
  getNextPageParam: getSearchMovieNextPageParam,
  enabled: search.length > 2,
  select: selectSearchMoviesData,
});

export const useSearchMoviesInfinityQuery = (search: string) => {
  const [debouncedSearch] = useDebounce(search, 300);
  const query = useInfiniteQuery(
    getSearchMovieInfinityQueryOptions(debouncedSearch),
  );

  return query;
};
