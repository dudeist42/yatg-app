'use client';
import { MoviesSearchModal } from '@/features/search-movie/ui';
import { Button } from '@heroui/react/button';
import { SearchField, SearchFieldProps } from '@heroui/react/search-field';
import { useState } from 'react';

export type TSearchButtonProps = {
  variant?: SearchFieldProps['variant'];
};

export const SearchButton = ({ variant }: TSearchButtonProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
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
    </>
  );
};
