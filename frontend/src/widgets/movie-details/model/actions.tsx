'use client';
import { userMoviesQueries } from '@/entities/user-movies';
import { useMutation, useMutationState } from '@tanstack/react-query';
import { useMovieId } from './model';
import { useCallback } from 'react';
import { useDebounce } from 'use-debounce';

export const useWatchMovieActions = () => {
  const movieId = useMovieId();

  const { mutate: mutateWatch } = useMutation(
    userMoviesQueries.upsertWatchedMutation,
  );
  const { mutate: mutateUnwatch } = useMutation(
    userMoviesQueries.deleteWatchedMutation,
  );
  const watchPendings = useMutationState({
    filters: {
      mutationKey: userMoviesQueries.upsertWatchedMutation.mutationKey,
      status: 'pending',
    },
    select: () => true,
  });
  const unwatchPendings = useMutationState({
    filters: {
      mutationKey: userMoviesQueries.deleteWatchedMutation.mutationKey,
      status: 'pending',
    },
    select: () => true,
  });

  const isPending = watchPendings.length > 0 || unwatchPendings.length > 0;
  const [debouncedIsPending] = useDebounce(isPending, 500, {
    leading: true,
    trailing: true,
  });

  const watchMovie = useCallback(
    (rating?: number | null) => {
      if (!movieId) return;

      mutateWatch({ params: { movieId }, body: { rating } });
    },
    [mutateWatch, movieId],
  );

  const unwatchMovie = useCallback(() => {
    if (!movieId) return;

    mutateUnwatch({ movieId });
  }, [mutateUnwatch, movieId]);

  return {
    watchMovie,
    unwatchMovie,
    isPending,
    debouncedIsPending,
  };
};
