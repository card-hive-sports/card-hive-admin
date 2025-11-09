export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;
export type SORT_ORDER = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
