import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import { useAuthStore } from '../store/authStore';
import jwtDecode from 'jwt-decode';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

jest.mock('jwt-decode', () => jest.fn());
jest.mock('../hooks/useSessionTimeout', () => ({
  useSessionTimeout: jest.fn(),
}));

const mockUser = {
  userId: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  active: true,
  token: 'valid-token',
  roles: ['admin'],
};

beforeEach(() => {
  jest.clearAllMocks();
  (jwtDecode as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
  useAuthStore.setState({ user: mockUser });
});

it('renders Sidebar with Header, Nav and Footer', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<span>dashboard content</span>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('MiApp')).toBeInTheDocument();
  expect(screen.getByText('Inicio')).toBeInTheDocument();
  expect(screen.getByText('Administrar')).toBeInTheDocument();
  expect(screen.getByText('Perfil')).toBeInTheDocument();
  expect(screen.getByText('Configuración')).toBeInTheDocument();
  expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(useSessionTimeout).toHaveBeenCalled();
});

it('renders Outlet content', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<span>dashboard content</span>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('dashboard content')).toBeInTheDocument();
});

it('clears user and navigates to / when token is expired', () => {
  (jwtDecode as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 3600 });

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<span>dashboard content</span>} />
          <Route path="/" element={<span>login page</span>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(useAuthStore.getState().user).toBeNull();
  expect(screen.getByText('login page')).toBeInTheDocument();
});
