import { queryOptions } from '@tanstack/react-query';
import { getMe } from './api';
import { meKeys } from './query-keys';
import { selectData } from '@/shared/lib/query-utils';

export const getMeQueryOptions = queryOptions({
  queryFn: getMe,
  queryKey: meKeys.all,
  select: selectData,
});
