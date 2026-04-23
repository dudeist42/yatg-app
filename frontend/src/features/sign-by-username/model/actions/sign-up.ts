'use server';

import { TSignUpReponse } from '@yatg-app/api-types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type TSignUpState = {
  status: number | null;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export const signUp = async (
  prevState: TSignUpState,
  formData: FormData,
): Promise<TSignUpState> => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const [backendResponse, cookiesStore] = await Promise.all([
    fetch(`${process.env.API_URL}/api/v1/auth/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
    cookies(),
  ]);
  const responseBody = await backendResponse.json();

  if (backendResponse.status === 200) {
    const body = responseBody as TSignUpReponse;
    cookiesStore.set('access_token', body.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(body.data.accessTokenExpiresAt),
    });
    cookiesStore.set('refresh_token', body.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(body.data.refreshTokenExpiresAt),
    });

    redirect('/');
  }

  return {
    status: backendResponse.status,
    data: responseBody?.data ?? responseBody,
  };
};
