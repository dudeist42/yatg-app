import type { TResponse } from "../../shared/generic.response";

export type TSignUpBodyDto = {
  username: string;
  password: string;
}

export type TSignUpReponse = TResponse<{
  accessToken: string;
  expiresAt: Date;
}>