import { TSignInBodyDto, TSignInResponse } from '@yatg-app/api-types';
import axios from 'axios';

export const signIn = async (body: TSignInBodyDto) =>
  axios
    .post<TSignInResponse>(`${process.env.API_URL}/api/v1/auth/sign-in`, body, {
      timeout: 5000,
      timeoutErrorMessage: 'Time out. Try again later.',
    })
    .then((r) => r.data);
