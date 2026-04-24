import { UserInfo } from './ui/user-info/user-info';
import {
  SearchButton,
  TSearchButtonProps,
} from './ui/search-button/search-button';
import { HomeLink } from './ui/home-link/home-link';
import classes from './app-bar.module.css';
import { getQueryClient } from '@/shared/lib/query-client';
import { meQueries } from '@/entities/me';
import { getIsClientNavigation } from '@/shared/lib/ssr';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export type TAppBarProps = {
  searchButtonProps?: TSearchButtonProps;
};

export const AppBar = async ({ searchButtonProps }: TAppBarProps) => {
  const queryClient = getQueryClient();
  const isClientNavigation = await getIsClientNavigation();

  if (!isClientNavigation) {
    await queryClient.prefetchQuery(meQueries.getMeQueryOptions);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={classes.root}>
        <HomeLink />
        <div className={classes.search}>
          <SearchButton {...searchButtonProps} />
        </div>
        <UserInfo />
      </div>
    </HydrationBoundary>
  );
};
