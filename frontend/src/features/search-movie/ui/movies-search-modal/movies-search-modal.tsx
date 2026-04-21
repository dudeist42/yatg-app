'use client';
import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Kbd } from '@heroui/react/kbd';
import { Modal } from '@heroui/react/modal';
import { SearchField } from '@heroui/react/search-field';
import { Separator } from '@heroui/react/separator';
import { MovieSearchItem, moviesQueries } from '@/entities/movies';

export type TMoviesSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MoviesSearchModal = ({
  isOpen,
  onClose,
}: TMoviesSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const { data: movies, isFetching } = useInfiniteQuery(
    moviesQueries.findInfiniteQueryOptions({ query: searchQuery }),
  );

  const isMoviesFound = !!movies && movies.length > 0;
  const hasSearchQuery = searchQuery.length > 2;
  const isLoading =
    hasSearchQuery && (searchQuery !== debouncedSearch || isFetching);

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      onClose();
    }
  };

  const isResultsEmpty = hasSearchQuery && !isLoading && !movies?.length;
  const isResultsVisible = isMoviesFound && hasSearchQuery && !isLoading;

  useEffect(
    () => () => {
      if (!isOpen) {
        setSearchQuery('');
      }
    },
    [isOpen],
  );

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container placement="top">
        <Modal.Dialog aria-label="Search movies" className="max-w-[768px] p-0">
          <Modal.Body className="flex flex-col">
            <div className="py-4 flex flex-col overflow-hidden">
              <div className="px-4">
                <SearchField
                  aria-label="search"
                  variant="primary"
                  autoFocus
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                >
                  <SearchField.Group className="ring-0 text-2xl hover:bg-transparent shadow-none">
                    <SearchField.SearchIcon className="size-6" />
                    <SearchField.Input
                      className="text-xl"
                      placeholder="What are you searching for?"
                    />
                    <Kbd>
                      <Kbd.Content>ESC</Kbd.Content>
                    </Kbd>
                  </SearchField.Group>
                </SearchField>
                <Separator className="mt-1 mb-3" />
              </div>
              {isResultsEmpty && (
                <div className="px-4 font-semibold text-lg text-gray-400">
                  Not found anything
                </div>
              )}
              {isLoading && (
                <div className="flex flex-col px-4 gap-2 overflow-y-scroll">
                  {Array.from({ length: 10 }, (_, idx) => (
                    <MovieSearchItem key={idx} />
                  ))}
                </div>
              )}
              {isResultsVisible && (
                <div className="flex flex-col px-4 gap-2 overflow-y-scroll">
                  {movies.map((movie) => {
                    return (
                      <MovieSearchItem
                        key={movie.id}
                        as={Link}
                        href={`/movie/${movie.id}`}
                        movie={movie}
                        prefetch={false}
                        className="hover:bg-gray-400/20"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
