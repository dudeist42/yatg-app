'use client';
import { ComponentProps, ElementType } from 'react';
import clsx from 'clsx';
import { Skeleton } from '@heroui/react/skeleton';
import { EyeIcon } from '@phosphor-icons/react/Eye';
import styles from './user-movie-card.module.css';
import { Serialized, TUserMovieEntity } from '@yatg-app/api-types';
import { MoviePoster } from '@/shared/ui/movie-poster';

type TUserMovieCardOwnProps = {
  movie?: Serialized<TUserMovieEntity>;
  className?: string;
};
export type TUserMovieCardProps<Component extends ElementType> = Omit<
  ComponentProps<Component>,
  keyof TUserMovieCardOwnProps
> & {
  As?: Component;
} & TUserMovieCardOwnProps;

export const UserMovieCard = <Component extends ElementType>({
  movie,
  className,
  As = 'div' as Component,
  ...rootProps
}: TUserMovieCardProps<Component>) => {
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
