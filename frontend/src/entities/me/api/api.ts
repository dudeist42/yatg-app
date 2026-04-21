import { client } from '@/shared/lib/api-client';
import { TGetMeResponse } from '@yatg-app/api-types';

export const getMe = () =>
  client.get<TGetMeResponse>('/auth/me').then((r) => r.data);
