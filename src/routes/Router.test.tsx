import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Router from './Router';
import { useAuthStore } from '../store/authStore';

const validJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTksImlkIjoiMSJ9.sig';

const mockUser = {
  userId: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  active: true,
  token: validJwt,
};

beforeEach(() => {
  useAuthStore.setState({ user: null });
});

it('renders LoginPage at "/"', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Router />
    </MemoryRouter>
  );

  expect(await screen.findByText('Iniciar Sesión')).toBeInTheDocument();
});

it('redirects to "/dashboard" when authenticated at "/"', async () => {
  useAuthStore.setState({ user: mockUser });
  render(
    <MemoryRouter initialEntries={['/']}>
      <Router />
    </MemoryRouter>
  );

  expect(await screen.findByText('DASHBOARD')).toBeInTheDocument();
});

it('redirects to login at "/dashboard" when unauthenticated', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Router />
    </MemoryRouter>
  );

  expect(await screen.findByText('Iniciar Sesión')).toBeInTheDocument();
});
