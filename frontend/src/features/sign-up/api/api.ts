import { client } from '@/shared/lib/api-client';
import { TSignUpBodyDto } from '@yatg-app/api-types';

export const signUp = (body: TSignUpBodyDto) =>
  client.post('/auth/sign-up', body).then((r) => r.data);
