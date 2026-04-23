import { TRefreshTokenResponse } from '@yatg-app/api-types';

export class RefreshTokenResponse implements TRefreshTokenResponse {
  data!: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
}
