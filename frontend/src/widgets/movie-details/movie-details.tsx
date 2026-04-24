import { MovieBackground } from './ui/movie-background';
import { MovieProvider } from './model/model';
import { MovieTitle } from './ui/movie-title';
import { getQueryClient } from '@/shared/lib/query-client';
import { moviesQueries } from '@/entities/movies';
import { fetchCachedMovieById } from './api/fetch-cached-movie';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getIsClientNavigation } from '@/shared/lib/ssr';
import { DetailedMovie } from './ui/detailed-movie';

export type TMovieDetailsProps = {
  movieId: number;
};

export const MovieDetails = async (props: TMovieDetailsProps) => {
  const movieId = props.movieId;
  const client = getQueryClient();
  const isClientNavigation = await getIsClientNavigation();

  if (!isClientNavigation) {
    await client.prefetchQuery({
      ...moviesQueries.getByIdQueryOptions({ id: movieId }),
      queryFn: () => fetchCachedMovieById(movieId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <MovieProvider movieId={movieId}>
        <MovieTitle />
        <MovieBackground />
        <DetailedMovie />
      </MovieProvider>
    </HydrationBoundary>
  );
};
