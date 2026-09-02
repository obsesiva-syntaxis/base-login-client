import { create } from 'zustand';
import type { UserApi } from '../interfaces/user/user.interface';
import { userService } from '../services/userService';

const PAGE_SIZE = 8;

interface UsersState {
  users: UserApi[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  editingUser: UserApi | null;
  isEditModalOpen: boolean;
  fetchUsers: (page?: number) => Promise<void>;
  setPage: (page: number) => void;
  startEdit: (user: UserApi) => void;
  closeEdit: () => void;
  clear: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  editingUser: null,
  isEditModalOpen: false,
  fetchUsers: async (page = get().page) => {
    const { loading, page: currentPage } = get();
    if (loading && currentPage === page) return;
    set({ page, loading: true, error: null });
    try {
      const res = await userService.getAll(page, PAGE_SIZE);
      set({ users: res.data.rows, total: res.data.total });
    } catch (err: any) {
      set({ error: err.message ?? 'Error al cargar usuarios' });
    } finally {
      set({ loading: false });
    }
  },
  setPage: (page) => { void get().fetchUsers(page); },
  startEdit: (user) => set({ editingUser: user, isEditModalOpen: true }),
  closeEdit: () => set({ editingUser: null, isEditModalOpen: false }),
  clear: () => set({ users: [], total: 0, page: 1, loading: false, error: null, editingUser: null, isEditModalOpen: false }),
}));