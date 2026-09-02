import { useUsersStore } from './usersStore';
import { userService } from '../services/userService';

jest.mock('../services/userService', () => ({
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

const initialState = {
  users: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  editingUser: null,
  isEditModalOpen: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  useUsersStore.setState(initialState);
});

describe('fetchUsers', () => {
  it('loads users and total', async () => {
    (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
    await useUsersStore.getState().fetchUsers(1);
    expect(userService.getAll).toHaveBeenCalledWith(1, 8);
    expect(useUsersStore.getState().users).toEqual(MOCK_USERS);
    expect(useUsersStore.getState().total).toBe(10);
    expect(useUsersStore.getState().page).toBe(1);
    expect(useUsersStore.getState().loading).toBe(false);
  });

  it('keeps cached users while a background refresh is pending (SWR)', async () => {
    (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
    await useUsersStore.getState().fetchUsers(1);

    let resolveFetch!: (value: unknown) => void;
    (userService.getAll as jest.Mock).mockImplementation(
      () => new Promise((res) => { resolveFetch = res; })
    );
    const pending = useUsersStore.getState().fetchUsers(1);
    expect(useUsersStore.getState().loading).toBe(true);
    expect(useUsersStore.getState().users).toEqual(MOCK_USERS);

    resolveFetch(MOCK_RESPONSE);
    await pending;
    expect(useUsersStore.getState().loading).toBe(false);
    expect(useUsersStore.getState().users).toEqual(MOCK_USERS);
  });

  it('sets error and keeps previous users on failure', async () => {
    (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
    await useUsersStore.getState().fetchUsers(1);

    (userService.getAll as jest.Mock).mockRejectedValue(new Error('boom'));
    await useUsersStore.getState().fetchUsers(1);
    const state = useUsersStore.getState();
    expect(state.error).toBe('boom');
    expect(state.users).toEqual(MOCK_USERS);
    expect(state.loading).toBe(false);
  });

  it('dedupes concurrent fetches for the same page', async () => {
    let resolveFetch!: (value: unknown) => void;
    (userService.getAll as jest.Mock).mockImplementation(
      () => new Promise((res) => { resolveFetch = res; })
    );

    const first = useUsersStore.getState().fetchUsers(1);
    const second = useUsersStore.getState().fetchUsers(1);

    expect(userService.getAll).toHaveBeenCalledTimes(1);
    expect(useUsersStore.getState().loading).toBe(true);

    resolveFetch(MOCK_RESPONSE);
    await Promise.all([first, second]);
    expect(useUsersStore.getState().users).toEqual(MOCK_USERS);
    expect(useUsersStore.getState().loading).toBe(false);
  });

  it('allows a new fetch for the same page once the previous settled', async () => {
    (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
    await useUsersStore.getState().fetchUsers(1);
    await useUsersStore.getState().fetchUsers(1);
    expect(userService.getAll).toHaveBeenCalledTimes(2);
  });
});

describe('startEdit / closeEdit', () => {
  it('startEdit sets editing user and opens the modal', () => {
    useUsersStore.getState().startEdit(MOCK_USERS[0]);
    expect(useUsersStore.getState().editingUser).toEqual(MOCK_USERS[0]);
    expect(useUsersStore.getState().isEditModalOpen).toBe(true);
  });

  it('closeEdit resets editing state', () => {
    useUsersStore.getState().startEdit(MOCK_USERS[0]);
    useUsersStore.getState().closeEdit();
    expect(useUsersStore.getState().editingUser).toBeNull();
    expect(useUsersStore.getState().isEditModalOpen).toBe(false);
  });
});

describe('clear', () => {
  it('resets the whole store', async () => {
    (userService.getAll as jest.Mock).mockResolvedValue(MOCK_RESPONSE);
    await useUsersStore.getState().fetchUsers(1);
    useUsersStore.getState().startEdit(MOCK_USERS[0]);
    useUsersStore.getState().clear();
    expect(useUsersStore.getState()).toEqual(expect.objectContaining(initialState));
  });
});
