'use client';
import { Rating } from '@/shared/ui';
import { useWatchMovieActions } from '../../model/actions';
import { useMovieField } from '../../model/selectors';
import { useCallback } from 'react';

export const MovieRating = () => {
  const userRating = useMovieField('userRating');
  const { watchMovie, debouncedIsPending } = useWatchMovieActions();

  const handleRatingChange = useCallback(
    (rating: number) => {
      watchMovie(rating === userRating ? null : rating);
    },
    [watchMovie, userRating],
  );

  return (
    <Rating
      rating={userRating ?? -1}
      onChange={handleRatingChange}
      disabled={debouncedIsPending}
    />
  );
};
