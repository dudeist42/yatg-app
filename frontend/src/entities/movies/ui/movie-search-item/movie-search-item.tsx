import { ComponentPropsWithoutRef, ElementType } from 'react';
import clsx from 'clsx';
import { Serialized, TMovieEntity } from '@yatg-app/api-types';
import { MoviePoster } from '@/shared/ui/movie-poster';
import { Skeleton } from '@heroui/react/skeleton';

import classes from './movie.search-item.module.css';

export type TMovieSearchItemProps<As extends ElementType> = {
  as?: As;
  movie?: Serialized<TMovieEntity>;
  className?: string;
} & Omit<ComponentPropsWithoutRef<As>, 'as' | 'movie'>;
export const MovieSearchItem = <As extends ElementType>({
  movie,
  as = 'div' as As,
  className,
  ...props
}: TMovieSearchItemProps<As>) => {
  const Root = as as ElementType;
  const date = movie?.releaseDate ? new Date(movie.releaseDate) : null;

  return (
    <Root {...props} className={clsx(classes.item, className)}>
      <MoviePoster
        loading={!movie}
        width={80}
        size="s"
        path={movie?.posterPath}
      />
      {movie && (
        <div className={classes.content}>
          <div className={classes.title}>{movie.title}</div>
          {date && <div className={classes.subtitle}>{date.getFullYear()}</div>}
        </div>
      )}
      {!movie && <Skeleton className="h-[28px] w-3/5" />}
    </Root>
  );
};
