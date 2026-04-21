import type { TResponse } from "../../shared/generic.response";

export type TSignInBodyDto = {
  username: string;
  password: string;
}

export type TSignInResponse = TResponse<{
  accessToken: string;
  expiresAt: Date;
}>