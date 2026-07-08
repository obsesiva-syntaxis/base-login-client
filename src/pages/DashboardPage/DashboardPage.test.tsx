import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { useAuthStore } from '../../store/authStore';

const validJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTksImlkIjoiMSJ9.sig';

const mockUser = {
  userId: '1',
  email: 'maria@test.com',
  fullName: 'Maria Lopez',
  active: true,
  token: validJwt,
};

describe('DashboardPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('shows DASHBOARD heading', () => {
    render(<DashboardPage />);
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
  });

  it('shows welcome with user full name when authenticated', () => {
    useAuthStore.setState({ user: mockUser });
    render(<DashboardPage />);
    expect(screen.getByText('Bienvenido Maria Lopez')).toBeInTheDocument();
  });

  it('shows heading "No hay usuario logueado" when no user', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'No hay usuario logueado' })).toBeInTheDocument();
  });

  it('shows subtitle "No hay usuario logueado" when no user', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { level: 3, name: 'No hay usuario logueado' })).toBeInTheDocument();
  });

  it('shows user email when authenticated', () => {
    useAuthStore.setState({ user: mockUser });
    render(<DashboardPage />);
    expect(screen.getByText('maria@test.com')).toBeInTheDocument();
  });

  it('matches snapshot when unauthenticated', () => {
    const { container } = render(<DashboardPage />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when authenticated', () => {
    useAuthStore.setState({ user: mockUser });
    const { container } = render(<DashboardPage />);
    expect(container).toMatchSnapshot();
  });
});
