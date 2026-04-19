import { AppBar } from '@/components/app-bar/app-bar';
import { UserMovies } from '@/components/user-movies/user-movies';
import { clientApi } from '@/lib/clientApi/api';
import { getQueryClient } from '@/lib/query-client';
import { isClientNavigation } from '@/lib/ssr/is-client-navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const meQueryOptions = {
  queryFn: clientApi.auth.me,
  queryKey: ['me'],
};

const myMoviesQueryOptions = {
  queryFn: ({ pageParam }: { pageParam: number }) =>
    clientApi.movies.getUserMovies({ page: pageParam }),
  queryKey: ['my-movies'],
  initialPageParam: 1,
};

export default async function Home() {
  const client = getQueryClient();
  const isNavigation = await isClientNavigation();

  if (!isNavigation) {
    await Promise.all([
      client.prefetchQuery(meQueryOptions),
      client.prefetchInfiniteQuery(myMoviesQueryOptions),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="page">
        <AppBar />
        <UserMovies />
      </div>
    </HydrationBoundary>
  );
}
