import { EyeIcon } from '@phosphor-icons/react';
import { ComponentProps, ElementType } from 'react';
import styles from './user-movie.module.css';
import clsx from 'clsx';
import { MoviePoster } from '../movie-poster/movie-poster';
import { TUserMovie } from '@/lib/clientApi/api';
import { Skeleton } from '@heroui/react';

type TMovieCardOwnProps = {
  movie?: TUserMovie;
  className?: string;
};
export type TMovieCardProps<Component extends ElementType> = Omit<
  ComponentProps<Component>,
  keyof TMovieCardOwnProps
> & {
  As?: Component;
} & TMovieCardOwnProps;

export const UserMovie = <Component extends ElementType>({
  movie,
  className,
  As = 'div' as Component,
  ...rootProps
}: TMovieCardProps<Component>) => {
  const Root = As as ElementType;
  const releaseDate = movie?.releaseDate && new Date(movie.releaseDate);

  const isLoading = !movie;

  return (
    <Root {...rootProps} className={clsx(styles.root, className)}>
      <div className={styles.card}>
        <MoviePoster size="l" path={movie?.posterPath} loading={isLoading} />
        {(movie?.userWatchedAt || movie?.userRating) && (
          <div className={styles.userMarker}>
            {movie.userWatchedAt && !movie.userRating && <EyeIcon size={20} />}
            {!!movie.userRating && (
              <div className="font-semibold">{movie.userRating}</div>
            )}
          </div>
        )}
      </div>
      {isLoading && (
        <div className="mt-1 space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3.5 w-1/5" />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className={styles.title}>{movie.title}</div>
          {!!releaseDate && (
            <div className={styles.subtitle}>{releaseDate.getFullYear()}</div>
          )}
        </div>
      )}
    </Root>
  );
};
