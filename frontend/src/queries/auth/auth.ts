import { clientApi } from '@/lib/clientApi/api';
import { queryOptions } from '@tanstack/react-query';
import { selectData } from '../lib';

const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: clientApi.auth.me,
  select: selectData,
});

export const authQueries = {
  me: userQueryOptions,
};
