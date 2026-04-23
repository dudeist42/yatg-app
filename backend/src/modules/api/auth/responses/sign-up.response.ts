import { TSignUpReponse } from '@yatg-app/api-types';

export class SignUpResponse implements TSignUpReponse {
  data!: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
}
