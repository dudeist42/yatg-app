import { TSearchMovie } from '@/lib/clientApi/api';
import { ComponentPropsWithoutRef, ElementType } from 'react';
import { Skeleton } from '@heroui/react';
import clsx from 'clsx';
import classes from './movie.search-item.module.css';
import { MoviePoster } from '../movie-poster/movie-poster';

export type TMovieSearchItemProps<As extends ElementType> = {
  as?: As;
  movie?: TSearchMovie;
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
