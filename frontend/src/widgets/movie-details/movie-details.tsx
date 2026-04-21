'use client';
import { useCallback, useEffect, useEffectEvent, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DotIcon } from '@phosphor-icons/react/Dot';
import { EyeIcon } from '@phosphor-icons/react/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/EyeSlash';
import { minutesToDuration } from '@/shared/lib/time';
import { userMoviesQueries } from '@/entities/user-movies';
import { moviesQueries } from '@/entities/movies';
import { MoviePoster, Rating, DynamicBackground } from '@/shared/ui';
import classes from './movie-details.module.css';
import { useDebounce } from 'use-debounce';

export type TMovieDetailsProps = {
  movieId: number;
};

export const MovieDetails = (props: TMovieDetailsProps) => {
  const movieQuery = useQuery(
    moviesQueries.getByIdQueryOptions({ id: props.movieId }),
  );
  const { mutate: watchMovie, isPending: isWatchMoviePending } = useMutation(
    userMoviesQueries.upsertWatchedMutation,
  );
  const { mutate: unwatchMovie, isPending: isUnwatchMoviePending } =
    useMutation(userMoviesQueries.deleteWatchedMutation);
  const isWatchedPending = isWatchMoviePending || isUnwatchMoviePending;
  const [debouncedIsWatchedPending] = useDebounce(isWatchedPending, 350, {
    leading: true,
    trailing: true,
  });
  const router = useRouter();

  const error = movieQuery.error;
  const movieId = props.movieId;
  const movie = movieQuery.data;

  const backdropPath =
    movie?.backdropPath && `/api/tmdb-image/w1280${movie?.backdropPath}`;
  const currentRating = movie?.userRating ?? null;

  const releaseYear = movie?.releaseDate
    ? new Date(movie?.releaseDate).getFullYear()
    : '';

  const redirectToMain = useEffectEvent(() => {
    router.replace('/');
  });

  useEffect(() => {
    if (error) {
      redirectToMain();
    }
  }, [error]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const handleRatingChange = useCallback(
    (rating: number) => {
      watchMovie({
        params: { movieId },
        body: { rating: rating === currentRating ? null : rating },
      });
    },
    [watchMovie, movieId, currentRating],
  );

  const handleWatchMovie = useCallback(() => {
    watchMovie({
      params: { movieId },
    });
  }, [watchMovie, movieId]);

  const handleUnwatchMovie = useCallback(() => {
    unwatchMovie({ movieId });
  }, [unwatchMovie, movieId]);

  return (
    <>
      {movie && <title>{`${movie.title} | YATG`}</title>}
      {movie && <DynamicBackground src={backdropPath} darken={false} />}
      <div className="p-4 relative text-white">
        <div className="flex flex-row gap-12">
          <MoviePoster
            loading={movieQuery.isLoading}
            path={movie?.posterPath}
            size="xl"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-light">{releaseYear}</span>
            <span className="text-7xl font-bold">{movie?.title}</span>
            <span className="text-2xl font-bold">{movie?.tagline}</span>

            <div className="flex flex-row items-center mt-4 text-xl font-light">
              <span className="text-lg">
                {minutesToDuration(movie?.runtime ?? 0)}
              </span>
              <DotIcon size={40} weight="bold" />
              <div className={classes.genres}>
                {movie?.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-10">
              {movie?.userWatchedAt && (
                <Button
                  variant="outline"
                  className={classes.button}
                  onClick={handleUnwatchMovie}
                  isDisabled={isWatchedPending || debouncedIsWatchedPending}
                >
                  Mark as unseen
                  <div data-slot="spinner">
                    <EyeSlashIcon size={24} />
                  </div>
                </Button>
              )}
              {!movie?.userWatchedAt && (
                <Button
                  variant="tertiary"
                  className={classes.button}
                  onClick={handleWatchMovie}
                  isDisabled={isWatchedPending || debouncedIsWatchedPending}
                >
                  Mark as seen
                  <div data-slot="spinner">
                    <EyeIcon data-slot="spinner" size={24} />
                  </div>
                </Button>
              )}
              <Rating
                rating={movie?.userRating ?? -1}
                onChange={handleRatingChange}
                disabled={isWatchedPending || debouncedIsWatchedPending}
              />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 max-w-4xl">
          <span className="text-2xl font-bold">Overview</span>
          <span className="text-xl">{movie?.overview}</span>
        </div>
      </div>
    </>
  );
};
