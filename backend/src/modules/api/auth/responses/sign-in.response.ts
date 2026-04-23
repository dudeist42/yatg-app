import { TSignInResponse } from '@yatg-app/api-types';

export class SignInResponse implements TSignInResponse {
  data!: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
}
