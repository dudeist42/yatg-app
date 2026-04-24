import {
  TRefreshTokenBodyDto,
  TRefreshTokenResponse,
} from '@yatg-app/api-types';
import axios from 'axios';

export const refreshToken = (body: TRefreshTokenBodyDto) =>
  axios
    .post<TRefreshTokenResponse>(
      `${process.env.API_URL}/api/v1/auth/refresh`,
      body,
    )
    .then((r) => r.data);
