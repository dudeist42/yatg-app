import { TPaginatedMeta, TPaginatedResponse } from '@yatg-app/api-types';

export class PaginationMeta implements TPaginatedMeta {
  page!: number;
  totalItems!: number;
  totalPages!: number;
}
export class PaginatedResponse<T> implements TPaginatedResponse<T> {
  data!: T[];
  meta!: PaginationMeta;
}
