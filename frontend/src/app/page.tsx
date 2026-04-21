import { AppBar } from '@/widgets/app-bar';
import { UserMovies } from '@/widgets/user-movies';
import { getQueryClient } from '@/shared/lib/query-client';
import { getIsClientNavigation } from '@/shared/lib/ssr';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { meQueries } from '@/entities/me';
import { userMoviesQueries } from '@/entities/user-movies';

export default async function Home() {
  const client = getQueryClient();
  const isClientNavigation = await getIsClientNavigation();

  if (!isClientNavigation) {
    await Promise.all([
      client.prefetchQuery(meQueries.getMeQueryOptions),
      client.prefetchInfiniteQuery(
        userMoviesQueries.getAllInfiniteQueryOptions(),
      ),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="page">
        <AppBar variant="secondary" />
        <UserMovies />
      </div>
    </HydrationBoundary>
  );
}
