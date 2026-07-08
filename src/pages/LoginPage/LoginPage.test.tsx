import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AxiosAdapter } from '../../patterns/AxiosAdapter';
import { useAuthStore } from '../../store/authStore';

(AxiosAdapter.prototype as any).post = jest.fn().mockName('mockPost');
const mockPost = (AxiosAdapter.prototype as any).post as jest.Mock;

const mockNavigate = jest.fn().mockName('mockNavigate');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

const defaultUser = {
  id: '1',
  email: 'a@b.com',
  fullname: 'User',
  active: true,
  created_at: new Date().toISOString(),
};

const defaultApiResponse = {
  token: 'abc',
  user: defaultUser,
};

beforeEach(() => {
  mockPost.mockReset();
  useAuthStore.setState({ user: null });
});

it('prototype mock is wired correctly', async () => {
  mockPost.mockResolvedValue(defaultApiResponse);
  const result = await (AxiosAdapter.prototype as any).post('/test', {});
  expect(result.token).toBe('abc');
  expect(mockPost).toHaveBeenCalledWith('/test', {});
});

it('renders form with email and password fields', () => {
  renderLoginPage();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
});

it('shows validation errors on empty submit', async () => {
  renderLoginPage();
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  await waitFor(() => {
    expect(screen.getAllByText('Campo requerido')).toHaveLength(2);
  });
});

it('validates email format', async () => {
  renderLoginPage();
  await userEvent.type(screen.getByLabelText('Email'), 'notanemail');
  await userEvent.type(screen.getByLabelText('Password'), 'x');
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  expect(await screen.findByText('Email debe ser en un formato válido')).toBeInTheDocument();
});

it('shows error message on API failure', async () => {
  mockPost.mockRejectedValue(new Error('Credenciales inválidas'));
  renderLoginPage();
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
  await userEvent.type(screen.getByLabelText('Password'), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
});

it('hides error message on dismiss click', async () => {
  mockPost.mockRejectedValue(new Error('Error!'));
  renderLoginPage();
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
  await userEvent.type(screen.getByLabelText('Password'), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  expect(await screen.findByText('Error!')).toBeInTheDocument();

  await userEvent.click(screen.getByTestId('dismiss-error'));
  expect(screen.queryByText('Error!')).not.toBeInTheDocument();
});

it('navigates to /dashboard on success', async () => {
  mockPost.mockResolvedValue(defaultApiResponse);
  renderLoginPage();
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
  await userEvent.type(screen.getByLabelText('Password'), 'pass');
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
});

it('shows error for inactive user', async () => {
  mockPost.mockResolvedValue({
    ...defaultApiResponse,
    user: { ...defaultUser, active: false },
  });
  renderLoginPage();
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
  await userEvent.type(screen.getByLabelText('Password'), 'pass');
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
  expect(await screen.findByText('Usuario inactivo, comuniquese con soporte técnico')).toBeInTheDocument();
});
