"use client";

import { create } from "zustand";
import {
  getCurrentPatron,
  logoutPatron,
  setStoredPatronToken,
} from "@/lib/api-client";
import type { PatronUser } from "@/types/auth";

interface AuthState {
  user: PatronUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: PatronUser | null) => void;
  fetchSession: (force?: boolean) => Promise<PatronUser | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user, initialized: true }),

  fetchSession: async (force = false) => {
    const state = get();
    if (state.initialized && !force) {
      return state.user;
    }

    set({ loading: true });
    try {
      const res = await getCurrentPatron();
      if (res.status === "success" && res.data?.user) {
        set({ user: res.data.user, loading: false, initialized: true });
        return res.data.user;
      }
      set({ user: null, loading: false, initialized: true });
      return null;
    } catch {
      set({ user: null, loading: false, initialized: true });
      return null;
    }
  },

  logout: async () => {
    try {
      await logoutPatron();
    } finally {
      setStoredPatronToken(null);
      set({ user: null, initialized: true });
    }
  },
}));
