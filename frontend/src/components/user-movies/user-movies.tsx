'use client';
import { clientApi, TUserMoviesReponse } from '@/lib/clientApi/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MovieCard } from '../movie-card/movie-card';
import { Button } from '@heroui/react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import Link from 'next/link';

const getUserMoviesQueryOptions = {
  queryFn: ({ pageParam }: { pageParam: number }) =>
    clientApi.movies.getUserMovies({ page: pageParam }),
  queryKey: ['my-movies'],
  initialPageParam: 1,
  getNextPageParam: (lastPage: TUserMoviesReponse) => {
    return lastPage.meta.page + 1;
  },
};

export const UserMovies = () => {
  const userMovies = useInfiniteQuery(getUserMoviesQueryOptions);

  const lastPage = userMovies.data?.pages.at(-1);
  const hasNextPage = lastPage && lastPage.meta.page < lastPage.meta.totalPages;

  return (
    <div className="p-3 mx-auto">
      <div className="grid grid-cols-[repeat(auto-fit,171px)] gap-4 justify-center">
        {userMovies.data?.pages.map((page) =>
          page.data.map((movie) => (
            <MovieCard
              As={Link}
              key={movie.id}
              title={movie.title}
              posterPath={movie.posterPath}
              posterWidth={342}
              releaseDate={movie.releaseDate}
              watched={!!movie.userWatchedAt}
              rating={movie.userRating}
              href={`/movie/${movie.id}`}
              prefetch={false}
            />
          )),
        )}
        {hasNextPage && (
          <div className="flex justify-center items-center">
            <Button variant="ghost" onClick={() => userMovies.fetchNextPage()}>
              Load More
              <ArrowRightIcon weight="bold" size={40} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
