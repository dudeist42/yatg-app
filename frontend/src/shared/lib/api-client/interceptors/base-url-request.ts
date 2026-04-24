import { InternalAxiosRequestConfig } from 'axios';

export const baseUrlRequestInterceptor = async (
  config: InternalAxiosRequestConfig<unknown>,
) => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const { cookies, headers } = await import('next/headers');

    const [headerStore, cookieStore] = await Promise.all([
      headers(),
      cookies(),
    ]);
    const host = headerStore.get('host');
    const protocol =
      host?.startsWith('localhost') || host?.startsWith('127.0.0.1')
        ? 'http'
        : 'https';
    config.baseURL = `${protocol}://${host}/api`;

    config.headers['Cookie'] = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
  }
  return config;
};
