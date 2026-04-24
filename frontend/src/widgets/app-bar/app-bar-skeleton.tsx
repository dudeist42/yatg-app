import { Skeleton } from '@heroui/react';
import { TAppBarProps } from './app-bar';
import classes from './app-bar.module.css';
import { HomeLink } from './ui/home-link/home-link';
import { SearchButton } from './ui/search-button/search-button';

export type TAppBarSkeletonProps = TAppBarProps;

export const AppBarSkeleton = ({ searchButtonProps }: TAppBarSkeletonProps) => {
  return (
    <div className={classes.root}>
      <HomeLink />
      <div className={classes.search}>
        <SearchButton {...searchButtonProps} />
      </div>
      <Skeleton className="w-11 h-4" />
    </div>
  );
};
