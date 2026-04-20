import { TPaginatedResponse, TResponse } from '@/lib/clientApi/api';
import { InfiniteData } from '@tanstack/react-query';

export const selectData = <Data>(data: TResponse<Data>) => {
  return data.data;
};

export const selectPaginatedData = <Data>(
  data: InfiniteData<TPaginatedResponse<Data>, number>,
): Data[] => {
  return data.pages.flatMap((page) => page.data);
};

export const getNextPageParam = (response: TPaginatedResponse<unknown>) => {
  const nextPage = response.meta.page + 1;

  return nextPage > response.meta.totalPages ? null : nextPage;
};
