'use client';
import { Button } from '@heroui/react/button';
import { EyeSlashIcon } from '@phosphor-icons/react/EyeSlash';
import { useWatchMovieActions } from '../../model/actions';
import { EyeIcon } from '@phosphor-icons/react/Eye';
import classes from './movie-watch-toggle.module.css';
import { useMovieField } from '../../model/selectors';

export const MovieWatchToggle = () => {
  const userWatchedAt = useMovieField('userWatchedAt');
  const { watchMovie, unwatchMovie, debouncedIsPending } =
    useWatchMovieActions();

  return (
    <>
      {userWatchedAt && (
        <Button
          variant="outline"
          className={classes.button}
          onClick={unwatchMovie}
          isPending={debouncedIsPending}
        >
          Mark as unseen
          <div data-slot="spinner">
            <EyeSlashIcon size={24} />
          </div>
        </Button>
      )}
      {!userWatchedAt && (
        <Button
          variant="tertiary"
          className={classes.button}
          onClick={() => watchMovie()}
          isPending={debouncedIsPending}
        >
          Mark as seen
          <div data-slot="spinner">
            <EyeIcon data-slot="spinner" size={24} />
          </div>
        </Button>
      )}
    </>
  );
};
