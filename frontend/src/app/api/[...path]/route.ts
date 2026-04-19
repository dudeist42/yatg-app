import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const handleRequest = async (
  request: NextRequest,
  ctx: RouteContext<'/api/[...path]'>,
) => {
  const [params, requestCookies] = await Promise.all([ctx.params, cookies()]);
  const path = params.path.join('/');
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.size
    ? `?${requestUrl.searchParams.toString()}`
    : '';
  const accessToken = requestCookies.get('access_token')?.value;
  const proxyUrl = `${process.env.API_URL}/api/v1/${path}${query}`;

  const proxyRequest = new Request(proxyUrl, request);
  proxyRequest.headers.append('Authorization', `Bearer ${accessToken}`);

  try {
    return fetch(proxyRequest);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception';

    return new Response(message, { status: 500 });
  }
};

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/[...path]'>,
) {
  return handleRequest(request, ctx);
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<'/api/[...path]'>,
) {
  return handleRequest(request, ctx);
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<'/api/[...path]'>,
) {
  return handleRequest(request, ctx);
}
