import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Protected } from './Protected';
import { useAuthStore } from '../store/authStore';

const validJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTksImlkIjoiMSJ9.sig';
const expiredJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjAsImlkIjoiMSJ9.sig';

const mockUser = {
  userId: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  active: true,
  token: validJwt,
};

const renderProtected = (initialEntries = ['/dashboard']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/dashboard" element={
          <Protected>
            <span>protected content</span>
          </Protected>
        } />
        <Route path="/" element={<span>login page</span>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  useAuthStore.setState({ user: null });
});

it('redirects to login when no user', async () => {
  renderProtected();
  expect(await screen.findByText('login page')).toBeInTheDocument();
});

it('renders children when user exists and token valid', () => {
  useAuthStore.setState({ user: mockUser });
  renderProtected();
  expect(screen.getByText('protected content')).toBeInTheDocument();
});

it('clears user and redirects to "/" when token expired', async () => {
  const expiredUser = {
    ...mockUser,
    token: expiredJwt,
  };
  useAuthStore.setState({ user: expiredUser });
  renderProtected();
  await waitFor(() => {
    expect(screen.getByText('login page')).toBeInTheDocument();
  });
  expect(useAuthStore.getState().user).toBeNull();
});
