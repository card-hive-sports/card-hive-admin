import { create } from 'zustand';
import {User} from "@/lib";
import React from "react";

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

export const useAuth = () => {
  const accessToken = authStore((s) => s.accessToken);
  const user = authStore((s) => s.user);
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const setAuth = authStore((s) => s.setAuth);
  const setAccessToken = authStore((s) => s.setAccessToken);
  const clearAuth = authStore((s) => s.clearAuth);

  return React.useMemo(
    () => ({ accessToken, user, isAuthenticated, setAuth, setAccessToken, clearAuth }),
    [accessToken, user, isAuthenticated, setAuth, setAccessToken, clearAuth]
  );
};
