import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookiesStore = await cookies();

  const accessToken = cookiesStore.get('access_token')?.value;

  try {
    await axios.post(
      `${process.env.API_URL}/api/v1/auth/sign-out`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000,
        timeoutErrorMessage: 'Time out. Try again later.',
      },
    );

    cookiesStore.delete('access_token');
    cookiesStore.delete('refresh_token');

    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof AxiosError) {
      return NextResponse.json(
        e.response?.data ?? { data: { message: 'Server error' }, status: 500 },
        { status: e.status ?? 500 },
      );
    }

    return NextResponse.json(
      { data: { message: 'Inknown error' }, status: 500 },
      { status: 500 },
    );
  }
}
