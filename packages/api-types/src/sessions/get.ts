import type { TPaginatedResponse } from "../shared/generic.response";
import type { TSessionEntity } from "../shared/entities/session.entity";

export type TGetSessionsQueryDto = {
  page?: number;
  limit?: number;
};

export type TGetSessionsResponse = TPaginatedResponse<TSessionEntity>;
