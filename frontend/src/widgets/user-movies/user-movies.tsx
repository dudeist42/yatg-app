import { userMoviesQueries } from '@/entities/user-movies';
import { getQueryClient } from '@/shared/lib/query-client';
import { getIsClientNavigation } from '@/shared/lib/ssr';
import { UserMoviesList } from '@/widgets/user-movies/ui/user-movies-list/user-movies-list';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const UserMovies = async () => {
  const queryClient = getQueryClient();
  const isClientNavigation = await getIsClientNavigation();

  if (!isClientNavigation) {
    await queryClient.prefetchInfiniteQuery(
      userMoviesQueries.getAllInfiniteQueryOptions(),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-3 mx-auto">
        <UserMoviesList />
      </div>
    </HydrationBoundary>
  );
};
