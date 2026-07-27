import { render, screen, waitFor } from '@testing-library/react';
import AdministrarPage from './AdministrarPage';
import { userService } from '../../services/userService';

jest.mock('../../services/userService', () => ({
  userService: {
    getAll: jest.fn(),
    delete: jest.fn(),
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

  it('shows loader while fetching', () => {
    (userService.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<AdministrarPage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
