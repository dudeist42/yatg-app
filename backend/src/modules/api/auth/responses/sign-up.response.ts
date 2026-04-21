import { TSignUpReponse } from '@yatg-app/api-types';

export class SignUpResponse implements TSignUpReponse {
  data!: {
    accessToken: string;
    expiresAt: Date;
  };
}
