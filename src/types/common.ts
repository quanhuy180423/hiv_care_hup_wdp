export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  response?: {
    status?: number;
    data?: { message?: string | { message?: string } };
  };
}
