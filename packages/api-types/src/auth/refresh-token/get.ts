import type { TResponse } from "../../shared/generic.response";

export type TRefreshTokenResponse = TResponse<{
  accessToken: string;
  expiresAt: Date;
}>