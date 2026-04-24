import { setTokenCookies } from '@/features/sign-by-username/lib/cookies';
import { refreshToken as refreshTokenRequest } from '@/features/sign-by-username/model/api';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookiesStore = await cookies();

  const refreshToken = cookiesStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { status: 401, data: { message: 'Unauthorized' } },
      { status: 401 },
    );
  }

  try {
    const backendResponse = await refreshTokenRequest({ refreshToken });

    await setTokenCookies(backendResponse);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        {
          status: e.status ?? 500,
          data: e.response?.data?.data ??
            e.response?.data ?? {
              message: e.message ?? 'Server error',
            },
        },
        { status: e.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        status: 500,
        data: {
          message: 'Unknown error',
        },
      },
      { status: 500 },
    );
  }
}
