'use client';
import { clientApi } from '@/lib/clientApi/api';
import { useSearchMoviesInfinityQuery } from '@/queries/movies/movies';
import { Popover, SearchField } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';

const ME_QUERY = { queryKey: ['me'], queryFn: clientApi.auth.me };

export const AppBar = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const { data } = useQuery(ME_QUERY);
  const [search, setSearch] = useState('');
  const searchQuery = useSearchMoviesInfinityQuery(search);

  return (
    <div className="flex px-3 py-3 items-center justify-between w-full">
      <Link href="/" prefetch={false} className="font-medium text-xl">
        YATG
      </Link>
      <div>
        <Popover>
          <Popover.Trigger className="cursor-pointer" aria-label="open search">
            <SearchField
              className="pointer-events-none"
              aria-hidden="true"
              aria-label="search"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input
                  tabIndex={-1}
                  className="w-70"
                  placeholder="Search..."
                  aria-hidden="true"
                />
                <SearchField.ClearButton aria-hidden="true" />
              </SearchField.Group>
            </SearchField>
          </Popover.Trigger>
          <Popover.Content
            placement="bottom"
            className="flex flex-col overflow-hidden max-w-[250px] top-0! transition-none! animate-none!"
          >
            <Popover.Dialog className="flex flex-col overflow-hidden pt-3">
              <SearchField
                ref={searchRef}
                aria-label="search"
                variant="secondary"
                autoFocus
                onChange={(value) => setSearch(value)}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input className="w-70" placeholder="Search..." />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              {(searchQuery.data?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-2 mt-3 -mx-2 overflow-y-scroll">
                  {searchQuery.data!.map((movie) => {
                    const date = movie.releaseDate
                      ? new Date(movie.releaseDate)
                      : null;

                    return (
                      <Link
                        key={movie.id}
                        prefetch={false}
                        className="flex flex-row gap-2 p-2 rounded-lg hover:bg-gray-400/20"
                        href={`/movie/${movie.id}`}
                      >
                        <MovieCard
                          className="w-[46px] h-[69px]"
                          posterWidth={92}
                          posterPath={movie.posterPath}
                        />
                        <div className="flex flex-col">
                          <div className="max-w-[250px] line-clamp-2">
                            {movie.title}
                          </div>
                          {date && (
                            <div className="text-sm font-light">
                              {date.getFullYear()}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
      <div>{data?.data?.username}</div>
    </div>
  );
};
