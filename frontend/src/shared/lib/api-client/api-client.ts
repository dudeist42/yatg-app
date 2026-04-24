import axios from 'axios';
import { baseUrlRequestInterceptor } from './interceptors/base-url-request';
import { refreshTokenResponseInterceptor } from './interceptors/refresh-token-response';

export const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

client.interceptors.request.use(baseUrlRequestInterceptor);

client.interceptors.response.use(
  undefined,
  refreshTokenResponseInterceptor(client),
);
