import { client } from '@/shared/lib/api-client';

export const signOut = () =>
  client.post<void>('/auth/sign-out').then((r) => r.data);
