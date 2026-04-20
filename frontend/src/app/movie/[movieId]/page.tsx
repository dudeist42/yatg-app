import { AppBar } from '@/components/app-bar/app-bar';
import { MovieDetails } from '@/components/movie-details/movie-details';
import { clientApi } from '@/lib/clientApi/api';
import { getQueryClient } from '@/lib/query-client';
import { isClientNavigation } from '@/lib/ssr/is-client-navigation';
import { queries } from '@/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { cache } from 'react';

export type TMoviePageProps = PageProps<'/movie/[movieId]'>;

const fetchMovieFn = cache(async (movieId: number) =>
  clientApi.movies.getById({ id: movieId }),
);

export async function generateMetadata({
  params,
}: TMoviePageProps): Promise<Metadata> {
  const [{ movieId }, isClientNav] = await Promise.all([
    params,
    isClientNavigation(),
  ]);

  if (!isClientNav) {
    try {
      const movie = await fetchMovieFn(Number(movieId));

      return {
        title: movie.data.title,
      };
    } catch {}
  }

  return {
    title: 'Loading...',
  };
}

export default async function MoviePage({ params }: TMoviePageProps) {
  const client = getQueryClient();
  const { movieId } = await params;
  const id = Number(movieId);

  if (!(await isClientNavigation())) {
    await Promise.all([
      client.prefetchQuery(queries.auth.me),
      client.prefetchQuery({
        ...queries.movie.getById(id),
        queryFn: () => fetchMovieFn(id),
      }),
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
