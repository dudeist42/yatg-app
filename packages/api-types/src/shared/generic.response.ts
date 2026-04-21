import type { Serialized } from "./serialized.response";

export type TPaginatedMeta = {
  page: number;
  totalItems: number;
  totalPages: number;
}

export type TPaginatedResponse<Data> = {
  data: Data[];
  meta: TPaginatedMeta;
}

export type TResponse<Data> = {
  data: Data;
}