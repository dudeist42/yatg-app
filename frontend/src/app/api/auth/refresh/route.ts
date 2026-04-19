import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const backendResponse = await fetch(
    `${process.env.API_URL}/api/v1/auth/refresh`,
    {
      headers: {
        Cookie: req.headers.get('cookie') ?? '',
      },
      method: 'POST',
    },
  );

  const data = await backendResponse.json();
  const response = NextResponse.json(data, { status: backendResponse.status });

  backendResponse.headers.getSetCookie().forEach((cookie) => {
    response.headers.append('set-cookie', cookie);
  });

  return response;
}
