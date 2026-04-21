import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
export interface IUnprocessableEntityError {
  readonly status: 422;
  message: string;
  errors?: Record<string, string[]>;
}

export const isUnprosessableEntityError = (
  error: unknown,
): error is AxiosError<IUnprocessableEntityError> => {
  return (
    isAxiosError(error) &&
    error.response?.status === 422 &&
    !!error.response.data &&
    typeof error.response.data === 'object' &&
    'status' in error.response.data &&
    error.response.data.status === 422
  );
};

export const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

async function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = client
      .post('/auth/refresh', null, {
        withCredentials: true,
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

client.interceptors.request.use(async (config) => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    const { cookies, headers } = await import('next/headers');

    const [headerStore, cookieStore] = await Promise.all([
      headers(),
      cookies(),
    ]);
    const host = headerStore.get('host');
    const protocol = host?.startsWith('localhost') ? 'http' : 'https';
    config.baseURL = `${protocol}://${host}/api`;

    config.headers['Cookie'] = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isServer = typeof window === 'undefined';
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (isServer) {
      return Promise.reject(error);
    }
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    if (isRefreshRequest) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshOnce();

      return client(originalRequest);
    } catch (refreshError) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }

      return Promise.reject(refreshError);
    }
  },
);
