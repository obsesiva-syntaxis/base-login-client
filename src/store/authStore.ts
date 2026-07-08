import { create } from "zustand";
import { persist } from "zustand/middleware";
import jwtDecode from "jwt-decode";
import type { UserLoggedEssence } from "../interfaces/auth/auth.interface";

interface JwtToken {
  id: string;
  iat: number;
  exp: number;
}

interface AuthStore {
  user: UserLoggedEssence | null;
  setUser: (user: UserLoggedEssence) => void;
  clearUser: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: UserLoggedEssence) => set({ user }),
      clearUser: () => set({ user: null }),
      isTokenExpired: () => {
        const user = get().user;
        if (!user) return true;
        try {
          const { exp }: JwtToken = jwtDecode(user.token);
          return Date.now() >= exp * 1000;
        } catch {
          return true;
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => () => {
        const { user, isTokenExpired, clearUser } = useAuthStore.getState();
        if (user && isTokenExpired()) {
          clearUser();
        }
      },
    }
  )
);
