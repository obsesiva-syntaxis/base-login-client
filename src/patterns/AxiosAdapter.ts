import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export interface HttpAdapter {
  get<X>(url: string): Promise<X>;
  post<X>(url: string, body: any): Promise<X>;
  patch<X>(id: number, url: string, body: any): Promise<X>;
  delete(id: number, url: string): Promise<number>;
}

export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance;

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL,
    });

    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().clearUser();
          window.location.href = "/";
        }
        const message =
          (error.response?.data as any)?.message ??
          error.message ??
          "Error inesperado";
        return Promise.reject(new Error(message));
      }
    );
  }

  async get<X>(url: string): Promise<X> {
    const { data } = await this.axios.get<X>(url);
    return data;
  }

  async post<X>(url: string, body: any): Promise<X> {
    const { data } = await this.axios.post(url, body);
    return data;
  }

  async patch<X>(id: number, url: string, body: any): Promise<X> {
    const { data } = await this.axios.patch(`${url}/${id}`, body);
    return data;
  }

  async delete(id: number, url: string): Promise<number> {
    await this.axios.delete(`${url}/${id}`);
    return id;
  }
}
