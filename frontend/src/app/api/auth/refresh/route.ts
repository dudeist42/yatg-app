import { TRefreshTokenResponse } from '@yatg-app/api-types';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookiesStore = await cookies();
  const backendResponse = await fetch(
    `${process.env.API_URL}/api/v1/auth/refresh`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        refreshToken: cookiesStore.get('refresh_token')?.value,
      }),
    },
  );

  const responseBody = await backendResponse.json();
  const response = NextResponse.json(
    backendResponse.status === 200 ? { succes: true } : responseBody,
    { status: backendResponse.status },
  );

  if (backendResponse.status === 200) {
    const body = responseBody as TRefreshTokenResponse;
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
  }

  return response;
}
