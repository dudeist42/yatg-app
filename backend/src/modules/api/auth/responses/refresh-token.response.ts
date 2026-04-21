import { TRefreshTokenResponse } from '@yatg-app/api-types';

export class RefreshTokenResponse implements TRefreshTokenResponse {
  data!: {
    accessToken: string;
    expiresAt: Date;
  };
}
