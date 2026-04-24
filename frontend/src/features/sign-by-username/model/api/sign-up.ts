import { TSignUpBodyDto, TSignUpReponse } from '@yatg-app/api-types';
import axios from 'axios';

export const signUp = async (body: TSignUpBodyDto) =>
  axios
    .post<TSignUpReponse>(`${process.env.API_URL}/api/v1/auth/sign-up`, body, {
      timeout: 5000,
      timeoutErrorMessage: 'Time out. Try again later.',
    })
    .then((r) => r.data);
