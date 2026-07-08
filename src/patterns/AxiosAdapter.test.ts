import axios from 'axios';
import { AxiosAdapter } from './AxiosAdapter';
import { useAuthStore } from '../store/authStore';

jest.mock('axios');

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
  _onRejected: null as any,
  _onFulfilledRequest: null as any,
};

const mockUser = {
  userId: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  active: true,
  token: 'valid-token',
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ user: null });
  localStorage.clear();
  (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  mockAxiosInstance.interceptors.response.use = jest.fn((_onFulfilled, onRejected) => {
    mockAxiosInstance._onRejected = onRejected;
  });
  mockAxiosInstance.interceptors.request.use = jest.fn((onFulfilled) => {
    mockAxiosInstance._onFulfilledRequest = onFulfilled;
  });
});

it('post sends request and returns data', async () => {
  mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });
  const http = new AxiosAdapter('http://base');
  const result = await http.post<{ id: number }>('/test', { foo: 'bar' });
  expect(result).toEqual({ id: 1 });
  expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', { foo: 'bar' });
});

it('get sends request and returns data', async () => {
  mockAxiosInstance.get.mockResolvedValue({ data: { id: 1 } });
  const http = new AxiosAdapter();
  const result = await http.get<{ id: number }>('/test');
  expect(result).toEqual({ id: 1 });
  expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
});

it('patch appends id to url', async () => {
  mockAxiosInstance.patch.mockResolvedValue({ data: { id: 1 } });
  const http = new AxiosAdapter();
  await http.patch(5, '/items', { name: 'foo' });
  expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/items/5', { name: 'foo' });
});

it('delete appends id to url', async () => {
  mockAxiosInstance.delete.mockResolvedValue({});
  const http = new AxiosAdapter();
  const result = await http.delete(3, '/items');
  expect(result).toBe(3);
  expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/items/3');
});

describe('request interceptor', () => {
  it('injects Authorization header when user has token', () => {
    useAuthStore.setState({ user: mockUser });
    const http = new AxiosAdapter();
    const config: any = { headers: {} };
    const result = mockAxiosInstance._onFulfilledRequest(config);
    expect(result.headers.Authorization).toBe('Bearer valid-token');
  });

  it('does not inject Authorization header when no user', () => {
    const http = new AxiosAdapter();
    const config: any = { headers: {} };
    const result = mockAxiosInstance._onFulfilledRequest(config);
    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('response interceptor', () => {
  it('calls clearUser and redirects on 401', () => {
    const clearUserSpy = jest.spyOn(useAuthStore.getState(), 'clearUser');
    const http = new AxiosAdapter();
    const axiosError = {
      response: { status: 401, data: { message: 'Unauthorized' } },
      message: 'Unauthorized',
    };
    Object.defineProperty(window, 'location', {
      value: { href: '/current' },
      writable: true,
    });
    expect(mockAxiosInstance._onRejected(axiosError)).rejects.toThrow('Unauthorized');
    expect(clearUserSpy).toHaveBeenCalled();
    clearUserSpy.mockRestore();
  });

  it('does NOT call clearUser on non-401 errors', () => {
    const clearUserSpy = jest.spyOn(useAuthStore.getState(), 'clearUser');
    const http = new AxiosAdapter();
    const axiosError = {
      response: { status: 403, data: { message: 'Forbidden' } },
      message: 'Forbidden',
    };
    expect(mockAxiosInstance._onRejected(axiosError)).rejects.toThrow('Forbidden');
    expect(clearUserSpy).not.toHaveBeenCalled();
    clearUserSpy.mockRestore();
  });
});

describe('error interceptor', () => {
  it('extracts message from response.data.message', async () => {
    const http = new AxiosAdapter();
    const axiosError = {
      response: { data: { message: 'Custom error' } },
      message: 'fallback',
    };
    await expect(mockAxiosInstance._onRejected(axiosError)).rejects.toThrow('Custom error');
  });

  it('falls back to error.message when no response data', async () => {
    const http = new AxiosAdapter();
    const axiosError = { message: 'Network Error' };
    await expect(mockAxiosInstance._onRejected(axiosError)).rejects.toThrow('Network Error');
  });

  it('falls back to "Error inesperado"', async () => {
    const http = new AxiosAdapter();
    await expect(mockAxiosInstance._onRejected({})).rejects.toThrow('Error inesperado');
  });

  it('extracts message from error.message when response has no data', async () => {
    const http = new AxiosAdapter();
    const axiosError = {
      response: { status: 500 },
      message: 'Internal server error',
    };
    await expect(mockAxiosInstance._onRejected(axiosError)).rejects.toThrow('Internal server error');
  });
});
