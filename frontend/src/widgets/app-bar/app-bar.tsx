'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SearchField, type SearchFieldProps } from '@heroui/react/search-field';
import { useQuery } from '@tanstack/react-query';
import { meQueries } from '@/entities/me/api';
import { MoviesSearchModal } from '@/features/search-movie';

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
    <div className="flex px-3 py-3 items-center justify-between w-full">
      <Link
        href="/"
        prefetch={false}
        className="font-medium text-xl focus-visible:focus-field-ring"
      >
        YATG
      </Link>
      <div>
        <button
          className="cursor-pointer focus-visible:outline-none focus-visible:focus-ring rounded-xl"
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
        <MoviesSearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      </div>
      <div>{data?.username}</div>
    </div>
  );
};
