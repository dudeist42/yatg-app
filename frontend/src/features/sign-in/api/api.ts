import { client } from '@/shared/lib/api-client';
import { TSignInBodyDto } from '@yatg-app/api-types';

export const signIn = (body: TSignInBodyDto) =>
  client.post('/auth/sign-in', body).then((r) => r.data);
