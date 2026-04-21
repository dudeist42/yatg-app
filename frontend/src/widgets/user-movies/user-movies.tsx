'use client';
import { Button } from '@heroui/react';
import { ArrowRightIcon } from '@phosphor-icons/react/ArrowRight';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userMoviesQueries } from '@/entities/user-movies';
import { UserMovieCard } from '@/entities/user-movies/ui';

export const UserMovies = () => {
  const {
    data: movies,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(userMoviesQueries.getAllInfiniteQueryOptions());

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="p-3 mx-auto">
      <div className="grid grid-cols-[repeat(auto-fit,171px)] gap-4 justify-center">
        {movies?.map((movie) => (
          <UserMovieCard
            As={Link}
            key={movie.id}
            movie={movie}
            href={`/movie/${movie.id}`}
            prefetch={false}
          />
        ))}
        {isFetching &&
          Array.from({ length: 10 }, (_, idx) => <UserMovieCard key={idx} />)}
        {hasNextPage && !isFetching && (
          <div className="flex justify-center items-center">
            <Button variant="ghost" onClick={loadMore}>
              Load More
              <ArrowRightIcon weight="bold" size={40} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
