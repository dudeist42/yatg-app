import { AppBar, AppBarSkeleton } from '@/widgets/app-bar';
import {
  UserMoviesSkeleton,
  UserMovies as UserMoviesWidget,
} from '@/widgets/user-movies';
import { Suspense } from 'react';

export const UserMovies = async () => {
  return (
    <>
      <Suspense fallback={<AppBarSkeleton />}>
        <AppBar searchButtonProps={{ variant: 'secondary' }} />
      </Suspense>
      <Suspense fallback={<UserMoviesSkeleton />}>
        <UserMoviesWidget />
      </Suspense>
    </>
  );
};
