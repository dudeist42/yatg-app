import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendResponse = await fetch(
    `${process.env.API_URL}/api/v1/auth/sign-in`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    },
  );

  const data = await backendResponse.json();
  const response = NextResponse.json(data, { status: backendResponse.status });

  backendResponse.headers.getSetCookie().forEach((cookie) => {
    response.headers.append('set-cookie', cookie);
  });

  return response;
}
