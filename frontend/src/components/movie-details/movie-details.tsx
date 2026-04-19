'use client';
import { clientApi } from '@/lib/clientApi/api';
import { useQuery } from '@tanstack/react-query';
import { MovieCard } from '../movie-card/movie-card';
import DynamicBackground from '../dynamic-background/dynamic-background';
import classes from './movie-details.module.css';
import { DotIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { Rating } from '../rating/rating';
import { Button } from '@heroui/react';
import { useCallback, useEffect, useEffectEvent } from 'react';
import {
  useUnwatchMovieMutation,
  useWatchMovieMutation,
} from '@/queries/movies/movies';
import { useRouter } from 'next/navigation';

export type TMovieDetailsProps = {
  movieId: number;
};

const getMovieQueryOptions = (movieId: number) => ({
  queryFn: () => clientApi.movies.getById({ id: movieId }),
  queryKey: ['movie', movieId],
});

const convertMinutesToDuration = (minutes: number) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');

  return `${hh}:${mm}`;
};

export const MovieDetails = (props: TMovieDetailsProps) => {
  const movieQuery = useQuery(getMovieQueryOptions(props.movieId));
  const { mutateAsync: watchMovie } = useWatchMovieMutation();
  const { mutateAsync: unwatchMovie } = useUnwatchMovieMutation();
  const router = useRouter();

  const error = movieQuery.error;
  const movieId = props.movieId;
  const movie = movieQuery.data?.data;
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const handleRatingChange = useCallback(
    (rating: number) => {
      watchMovie({
        id: movieId,
        rating: rating === currentRating ? null : rating,
      });
    },
    [watchMovie, movieId, currentRating],
  );

  const handleWatchMovie = useCallback(() => {
    watchMovie({
      id: movieId,
    });
  }, [watchMovie, movieId]);

  const handleUnwatchMovie = useCallback(() => {
    unwatchMovie({ id: movieId });
  }, [unwatchMovie, movieId]);

  return (
    <>
      {movie && <DynamicBackground src={backdropPath} darken={false} />}
      <div className="p-4 relative text-white">
        <div className="flex flex-row gap-12">
          {movieQuery.data && (
            <MovieCard posterPath={movie?.posterPath} posterWidth={500} />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-lg font-light">{releaseYear}</span>
            <span className="text-7xl font-bold">{movie?.title}</span>
            <span className="text-2xl font-bold">{movie?.tagline}</span>

            <div className="flex flex-row items-center mt-4 text-xl font-light">
              <span className="text-lg">
                {convertMinutesToDuration(movie?.runtime ?? 0)}
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
