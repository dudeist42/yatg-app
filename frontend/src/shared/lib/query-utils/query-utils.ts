import { InfiniteData } from '@tanstack/react-query';
import { Serialized, TPaginatedResponse, TResponse } from '@yatg-app/api-types';

export const selectData = <Data>(data: TResponse<Serialized<Data>>) => {
  return data.data;
};

export const selectPaginatedData = <Data>(
  data: InfiniteData<TPaginatedResponse<Serialized<Data>>, number>,
) => {
  return data.pages.flatMap((page) => page.data);
};

export const getNextPageParam = (response: TPaginatedResponse<unknown>) => {
  const nextPage = response.meta.page + 1;

  return nextPage > response.meta.totalPages ? null : nextPage;
};
