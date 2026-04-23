import type { TResponse } from "../../shared/generic.response";

export type TRefreshTokenBodyDto = {
  refreshToken: string;
}

export type TRefreshTokenResponse = TResponse<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}>