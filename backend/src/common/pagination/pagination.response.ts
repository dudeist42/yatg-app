export class PaginationMeta {
  page!: number;
  totalItems!: number;
  totalPages!: number;
}
export class PaginatedResponse<T> {
  data!: T[];
  meta!: PaginationMeta;
}
