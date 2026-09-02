export interface UserApi {
  id: string;
  email: string;
  fullname: string;
  active: boolean;
  roles: string[];
  created_at: string;
  modified_at: string | null;
  deleted_at: string | null;
}

export interface PaginatedData<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
