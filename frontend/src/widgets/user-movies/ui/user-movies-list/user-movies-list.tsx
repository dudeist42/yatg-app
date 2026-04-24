'use client';
import { userMoviesQueries } from '@/entities/user-movies';
import { UserMovieCard } from '@/entities/user-movies/ui';
import { Button } from '@heroui/react/button';
import { ArrowRightIcon } from '@phosphor-icons/react/ArrowRight';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { UserMoviesWrapper } from '../user-movies-wrapper';

export const UserMoviesList = () => {
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
    <UserMoviesWrapper>
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
    </UserMoviesWrapper>
  );
};
