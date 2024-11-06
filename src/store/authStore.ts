import { create } from "zustand";
import { persist } from "zustand/middleware";
import jwtDecode from "jwt-decode";

interface JwtToken {
  id: string;
  iat: number;
  exp: number;
}

interface UserLoggedEssence {
  userId: string;
  email: string;
  fullName: string;
  active: boolean;
  token: string;
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
        const { exp }: JwtToken = jwtDecode(user.token);
        return Date.now() >= exp * 1000;
      },
    }),
    { name: "auth-storage" }
  )
);
