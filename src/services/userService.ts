import { AxiosAdapter } from '../patterns/AxiosAdapter';
import type { ApiResponse, PaginatedData, UserApi } from '../interfaces/user/user.interface';

const API_URL = (process.env.REACT_APP_API_URL ?? 'http://localhost:3030/api');
const USERS_PATH = process.env.REACT_APP_USERS_PATH ?? '/users';
const http = new AxiosAdapter(API_URL);

export const userService = {
  getAll: (page = 1, limit = 10) =>
    http.get<ApiResponse<PaginatedData<UserApi>>>(`${USERS_PATH}?page=${page}&limit=${limit}`),

  delete: (id: string) =>
    http.delete(id, USERS_PATH),

  update: (id: string, body: Partial<UserApi>) =>
    http.patch<ApiResponse<UserApi>>(id, USERS_PATH, body),
};
