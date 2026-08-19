import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdministrarPage from './AdministrarPage';
import { userService } from '../../services/userService';
import { useUsersStore } from '../../store/usersStore';
import type { UserApi } from '../../interfaces/user/user.interface';

jest.mock('../../services/userService', () => ({
  userService: {
    getAll: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

const MOCK_USERS = [
  { id: '1', email: 'carlos@empresa.com', fullname: 'Carlos Mendoza', active: true, roles: ['admin'], created_at: '2026-07-27T00:00:00Z', modified_at: null, deleted_at: null },
  { id: '2', email: 'maria@empresa.com', fullname: 'María López', active: true, roles: ['editor'], created_at: '2026-07-27T00:00:00Z', modified_at: null, deleted_at: null },
];

const MOCK_RESPONSE = {
  statusCode: 200,
  message: 'OK',
  data: {
    rows: MOCK_USERS,
    total: 10,
    page: 1,
    limit: 8,
  },
  timestamp: '2026-07-27T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
  useUsersStore.setState({
    users: [],
    total: 0,
    page: 1,
    loading: false,
    error: null,
    editingUser: null,
    isEditModalOpen: false,
  });
});

describe('AdministrarPage', () => {
  it('renders heading and user count', async () => {
    render(<AdministrarPage />);
    expect(screen.getByText('Administrar Usuarios')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('10 usuarios')).toBeInTheDocument();
    });
  });

  it('renders table with columns', async () => {
    render(<AdministrarPage />);
    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Rol')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
    });
  });

  it('renders user data from API', async () => {
    render(<AdministrarPage />);
    await waitFor(() => {
      expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
      expect(screen.getByText('maria@empresa.com')).toBeInTheDocument();
    });
  });

  it('renders pagination', async () => {
    render(<AdministrarPage />);
    await waitFor(() => {
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });
  });

  it('shows skeleton while fetching', () => {
    (userService.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<AdministrarPage />);
    expect(screen.getByTestId('table__skeleton')).toBeInTheDocument();
  });

  it('shows cached rows during background refresh (SWR)', () => {
    (userService.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    useUsersStore.setState({
      users: MOCK_USERS as UserApi[],
      total: 10,
      page: 1,
      loading: true,
      error: null,
    });
    render(<AdministrarPage />);
    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('10 usuarios')).toBeInTheDocument();
    expect(screen.queryByTestId('table__skeleton')).not.toBeInTheDocument();
  });

  it('fades the table out when changing page', async () => {
    render(<AdministrarPage />);
    await waitFor(() => expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument());
    const wrapper = screen.getByTestId('table').closest('.administrar__table')!;
    expect(wrapper.classList.contains('administrar__table--in')).toBe(true);
    fireEvent.click(screen.getByText('2'));
    expect(wrapper.classList.contains('administrar__table--out')).toBe(true);
  });

  it('opens edit modal with pre-filled values when clicking Modificar', async () => {
    render(<AdministrarPage />);
    const editButtons = await screen.findAllByRole('button', { name: 'Modificar' });
    fireEvent.click(editButtons[0]);
    expect(screen.getByText('Editar usuario: Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Carlos Mendoza');
    expect(screen.getByLabelText('Email')).toHaveValue('carlos@empresa.com');
    expect(screen.getByLabelText('Roles (separados por coma)')).toHaveValue('admin');
  });

  it('calls update and reloads current page on submit', async () => {
    (userService.update as jest.Mock).mockResolvedValue({ data: {} });
    render(<AdministrarPage />);
    const editButtons = await screen.findAllByRole('button', { name: 'Modificar' });
    fireEvent.click(editButtons[0]);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nuevo@empresa.com' } });
    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => {
      expect(userService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ email: 'nuevo@empresa.com', roles: ['admin'] })
      );
      expect(userService.getAll).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByText('Editar usuario: Carlos Mendoza')).not.toBeInTheDocument();
  });

  it('blocks submit when email is invalid', async () => {
    (userService.update as jest.Mock).mockResolvedValue({ data: {} });
    render(<AdministrarPage />);
    const editButtons = await screen.findAllByRole('button', { name: 'Modificar' });
    fireEvent.click(editButtons[0]);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'correo-invalido' } });
    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => {
      expect(screen.getByText('Email debe ser en un formato válido')).toBeInTheDocument();
    });
    expect(userService.update).not.toHaveBeenCalled();
  });
});
