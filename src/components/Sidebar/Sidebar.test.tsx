import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  userId: '1',
  email: 'juan@test.com',
  fullName: 'Juan Perez',
  active: true,
  token: 'valid-token',
};

let mockLinks: { icon: string; label: string; onClick: jest.Mock }[];

const renderSidebar = () =>
  render(
    <MemoryRouter>
      <Sidebar>
        <Sidebar.Header />
        <Sidebar.Nav links={mockLinks} />
        <Sidebar.Footer />
      </Sidebar>
    </MemoryRouter>
  );

beforeEach(() => {
  useAuthStore.setState({ user: mockUser });
  mockLinks = [
    { icon: 'fas fa-home', label: 'Inicio', onClick: jest.fn() },
    { icon: 'fas fa-user', label: 'Perfil', onClick: jest.fn() },
  ];
  jest.clearAllMocks();
});

it('renders sidebar nav', () => {
  renderSidebar();
  expect(screen.getByTestId('sidebar')).toBeInTheDocument();
});

it('Header renders title and toggle button', () => {
  renderSidebar();
  expect(screen.getByText('MiApp')).toBeInTheDocument();
  expect(screen.getByLabelText('Alternar sidebar')).toBeInTheDocument();
});

it('Header toggle collapses and expands', async () => {
  renderSidebar();
  const toggle = screen.getByLabelText('Alternar sidebar');

  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

it('Nav renders all link buttons', () => {
  renderSidebar();
  expect(screen.getByText('Inicio')).toBeInTheDocument();
  expect(screen.getByText('Perfil')).toBeInTheDocument();
});

it('Nav clicking a link fires onClick', async () => {
  renderSidebar();
  await userEvent.click(screen.getByText('Inicio'));
  expect(mockLinks[0].onClick).toHaveBeenCalled();
});

it('Footer shows user avatar initial', () => {
  renderSidebar();
  expect(screen.getByText('J')).toBeInTheDocument();
});

it('Footer shows user name and email', () => {
  renderSidebar();
  expect(screen.getByText('Juan Perez')).toBeInTheDocument();
  expect(screen.getByText('juan@test.com')).toBeInTheDocument();
});

it('Footer toggles open on caret click', async () => {
  renderSidebar();
  const caret = screen.getByLabelText('Mostrar opciones de cuenta');

  expect(caret).toHaveAttribute('aria-expanded', 'false');

  await userEvent.click(caret);
  expect(caret).toHaveAttribute('aria-expanded', 'true');

  await userEvent.click(caret);
  expect(caret).toHaveAttribute('aria-expanded', 'false');
});

it('Footer logout clears user and navigates to /', async () => {
  renderSidebar();
  const caret = screen.getByLabelText('Mostrar opciones de cuenta');
  await userEvent.click(caret);

  await userEvent.click(screen.getByText('Cerrar sesión'));

  expect(useAuthStore.getState().user).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith('/');
});
