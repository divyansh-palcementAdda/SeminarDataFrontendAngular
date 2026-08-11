export interface ApiResponse<T> {
  success: boolean;
  message: String;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  sortBy: string;
  sortDir: string;
}
