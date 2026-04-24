import { TRefreshTokenResponse, TSignUpReponse } from '@yatg-app/api-types';
import { cookies } from 'next/headers';

export const setTokenCookies = async (
  response: TRefreshTokenResponse | TSignUpReponse | TSignUpReponse,
) => {
  const cookiesStore = await cookies();

  cookiesStore.set('access_token', response.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(response.data.accessTokenExpiresAt),
  });
  cookiesStore.set('refresh_token', response.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(response.data.refreshTokenExpiresAt),
  });
};
