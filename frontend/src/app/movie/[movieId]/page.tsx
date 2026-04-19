import { AppBar } from '@/components/app-bar/app-bar';
import { MovieDetails } from '@/components/movie-details/movie-details';
import { clientApi } from '@/lib/clientApi/api';
import { getQueryClient } from '@/lib/query-client';
import { isClientNavigation } from '@/lib/ssr/is-client-navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

const meQueryOptions = {
  queryFn: clientApi.auth.me,
  queryKey: ['me'],
};

const getMovieQueryOptions = (movieId: number) => ({
  queryFn: () => clientApi.movies.getById({ id: movieId }),
  queryKey: ['movie', movieId],
});

export type TMoviePageProps = PageProps<'/movie/[movieId]'>;

export default async function MoviePage({ params }: TMoviePageProps) {
  const client = getQueryClient();
  const { movieId } = await params;

  if (!(await isClientNavigation())) {
    await Promise.all([
      client.prefetchQuery(meQueryOptions),
      client.prefetchQuery(getMovieQueryOptions(Number(movieId))),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="page">
        <AppBar />
        <MovieDetails movieId={Number(movieId)} />
      </div>
    </HydrationBoundary>
  );
}
