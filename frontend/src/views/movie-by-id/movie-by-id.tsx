'use server';

import { getIsClientNavigation } from '@/shared/lib/ssr';
import { AppBar, MovieDetails } from '@/widgets';
import { AppBarSkeleton } from '@/widgets/app-bar';
import { MovieDetailsSkeleton, movieDetailsApi } from '@/widgets/movie-details';
import { Metadata } from 'next';
import { Suspense } from 'react';

export type TMovieByIdProps = {
  movieId: number;
};

export async function generateMovieByIdMetadata({
  movieId,
}: TMovieByIdProps): Promise<Metadata> {
  const isClientNavigation = await getIsClientNavigation();

  if (!isClientNavigation) {
    try {
      const movie = await movieDetailsApi.fetchCachedMovieById(movieId);

      return {
        title: movie.data.title,
      };
    } catch {}
  }

  return {
    title: 'Loading...',
  };
}

export const MovieById = async ({ movieId }: { movieId: number }) => {
  return (
    <>
      <Suspense fallback={<AppBarSkeleton />}>
        <AppBar />
      </Suspense>
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetails movieId={Number(movieId)} />
      </Suspense>
    </>
  );
};
