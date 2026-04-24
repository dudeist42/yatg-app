'use client';
import { minutesToDuration } from '@/shared/lib/time';
import { DotIcon } from '@phosphor-icons/react/Dot';
import classes from './movie-info.module.css';
import { useMovieInfo } from '../../model/selectors';

export const MovieInfo = () => {
  const info = useMovieInfo();

  const releaseDate = info?.releaseDate ? new Date(info.releaseDate) : null;

  return (
    <>
      <div className="flex flex-col max-sm:text-center max-sm:gap-3">
        <span className="text-lg max-sm:text-md font-light">
          {releaseDate?.getFullYear()}
        </span>
        <span className="text-7xl max-sm:text-4xl font-bold">
          {info?.title}
        </span>
        <span className="text-2xl max-sm:text-xl font-bold">
          {info?.tagline}
        </span>
      </div>

      <div className="flex flex-row items-center mt-4 text-xl font-light">
        <span className="text-lg">{minutesToDuration(info?.runtime ?? 0)}</span>
        <DotIcon size={40} weight="bold" />
        <div className={classes.genres}>
          {info?.genres?.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      </div>
    </>
  );
};
