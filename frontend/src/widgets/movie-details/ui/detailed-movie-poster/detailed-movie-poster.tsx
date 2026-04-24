'use client';
import { MoviePoster } from '@/shared/ui';
import { useMovieField, useMovieIsFetching } from '../../model/selectors';

export const DetailedMoviePoster = () => {
  const isFetching = useMovieIsFetching();
  const posterPath = useMovieField('posterPath');

  return (
    <MoviePoster
      className="max-sm:self-center"
      loading={isFetching}
      path={posterPath}
      size="xl"
    />
  );
};
