'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SearchField, type SearchFieldProps } from '@heroui/react/search-field';
import { useQuery } from '@tanstack/react-query';
import { meQueries } from '@/entities/me/api';
import { MoviesSearchModal } from '@/features/search-movie';
import { Button } from '@heroui/react/button';

export type TAppBarProps = {
  variant?: SearchFieldProps['variant'];
};

export const AppBar = ({ variant }: TAppBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data } = useQuery(meQueries.getMeQueryOptions);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="flex px-3 py-3 items-center w-full gap-3 relative z-1">
      <Link
        href="/"
        prefetch={false}
        className="font-medium text-xl focus-visible:focus-field-ring"
      >
        YATG
      </Link>
      <div className="w-full flex justify-center max-sm:justify-end">
        <button
          className="cursor-pointer focus-visible:outline-none focus-visible:focus-ring rounded-xl max-sm:hidden"
          aria-label="open search"
          onClick={openSearch}
        >
          <SearchField
            className="pointer-events-none"
            aria-hidden="true"
            aria-label="search"
            variant={variant}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                tabIndex={-1}
                className="w-70"
                placeholder="Search..."
                aria-hidden="true"
              />
            </SearchField.Group>
          </SearchField>
        </button>
        <Button
          className="hidden max-sm:block"
          aria-label="open search"
          size="sm"
          variant="ghost"
          onClick={openSearch}
        >
          <SearchField.SearchIcon />
        </Button>
        <MoviesSearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      </div>
      <div>{data?.username}</div>
    </div>
  );
};
