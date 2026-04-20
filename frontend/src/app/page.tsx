import { AppBar } from '@/components/app-bar/app-bar';
import { UserMovies } from '@/components/user-movies/user-movies';
import { getQueryClient } from '@/lib/query-client';
import { isClientNavigation } from '@/lib/ssr/is-client-navigation';
import { queries } from '@/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Home() {
  const client = getQueryClient();
  const isNavigation = await isClientNavigation();

  if (!isNavigation) {
    await Promise.all([
      client.prefetchQuery(queries.auth.me),
      client.prefetchInfiniteQuery(queries.movie.getUserMovies),
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
