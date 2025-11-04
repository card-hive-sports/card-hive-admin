import { create } from 'zustand';
import {User} from "@/lib";

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const authStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: true }),

  setUser: (user) =>
    set({ user }),

  setAuth: (token, user) =>
    set({ accessToken: token, user, isAuthenticated: true }),

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}));

export const useAuth = () => authStore((state) => ({
  accessToken: state.accessToken,
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setAccessToken: state.setAccessToken,
  setUser: state.setUser,
  setAuth: state.setAuth,
  clearAuth: state.clearAuth,
}));
