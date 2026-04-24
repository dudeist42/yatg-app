import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let refreshPromise: Promise<unknown> | null = null;

async function refreshOnce(axiosInstance: AxiosInstance) {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
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

export const refreshTokenResponseInterceptor =
  (axiosInstance: AxiosInstance) => async (error: AxiosError) => {
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
      await refreshOnce(axiosInstance);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }

      return Promise.reject(refreshError);
    }
  };
