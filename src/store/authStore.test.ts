import { useAuthStore } from './authStore';
import jwtDecode from 'jwt-decode';

jest.mock('jwt-decode', () => jest.fn());

const mockUser = {
  userId: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  active: true,
  token: 'valid-token',
};

beforeEach(() => {
  useAuthStore.setState({ user: null });
  localStorage.clear();
  jest.clearAllMocks();
});

describe('setUser', () => {
  it('stores user', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('persists to localStorage', () => {
    useAuthStore.getState().setUser(mockUser);
    const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    expect(stored.state.user).toEqual(mockUser);
  });
});

describe('clearUser', () => {
  beforeEach(() => {
    useAuthStore.getState().setUser(mockUser);
  });

  it('resets user to null', () => {
    useAuthStore.getState().clearUser();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('removes user from localStorage', () => {
    useAuthStore.getState().clearUser();
    const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    expect(stored.state.user).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('returns true when user is null', () => {
    expect(useAuthStore.getState().isTokenExpired()).toBe(true);
  });

  it('returns false for a valid token', () => {
    (jwtDecode as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isTokenExpired()).toBe(false);
  });

  it('returns true for an expired token', () => {
    (jwtDecode as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 3600 });
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isTokenExpired()).toBe(true);
  });

  it('returns true when jwtDecode throws', () => {
    (jwtDecode as jest.Mock).mockImplementation(() => { throw new Error('malformed token'); });
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isTokenExpired()).toBe(true);
  });
});

describe('persistence', () => {
  it('rehydrateStorage clears user when token is expired', () => {
    const expiredUser = { ...mockUser, token: 'expired-token' };
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: expiredUser } }));

    (jwtDecode as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 3600 });

    useAuthStore.setState({ user: expiredUser });
    useAuthStore.persist.rehydrate();

    expect(useAuthStore.getState().user).toBeNull();
  });
});
