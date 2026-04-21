import { cache } from 'react';
import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { moviesApi, moviesQueries } from '@/entities/movies';
import { meQueries } from '@/entities/me';
import { AppBar } from '@/widgets/app-bar';
import { MovieDetails } from '@/widgets/movie-details';
import { getQueryClient } from '@/shared/lib/query-client';
import { getIsClientNavigation } from '@/shared/lib/ssr';

export type TMoviePageProps = PageProps<'/movie/[movieId]'>;

const fetchMovieFn = cache(async (movieId: number) =>
  moviesApi.getById({ id: movieId }),
);

export async function generateMetadata({
  params,
}: TMoviePageProps): Promise<Metadata> {
  const [{ movieId }, isClientNav] = await Promise.all([
    params,
    getIsClientNavigation(),
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
  const [{ movieId }, isClientNavigation] = await Promise.all([
    params,
    getIsClientNavigation(),
  ]);
  const id = Number(movieId);

  if (!isClientNavigation) {
    await Promise.all([
      client.prefetchQuery(meQueries.getMeQueryOptions),
      client.prefetchQuery({
        ...moviesQueries.getByIdQueryOptions({ id }),
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
