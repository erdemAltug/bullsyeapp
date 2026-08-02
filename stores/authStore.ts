import { create } from 'zustand';
import {
  type AuthUser,
  fetchSession,
  loadStoredAuth,
  signInEmail,
  signOut as apiSignOut,
  signUpEmail,
} from '@/lib/auth';

type AuthTab = 'login' | 'register';

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  pending: boolean;
  authVisible: boolean;
  authTab: AuthTab;
  hydrate: () => Promise<void>;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setAuthTab: (tab: AuthTab) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,
  pending: false,
  authVisible: false,
  authTab: 'login',

  hydrate: async () => {
    try {
      const stored = await loadStoredAuth();
      if (stored.user) set({ user: stored.user });

      if (stored.sessionToken || stored.jwt) {
        const live = await fetchSession();
        if (live.user) {
          set({ user: live.user, hydrated: true });
          return;
        }
        // Explicit empty session → clear; network errors keep cache
        if (!live.error) {
          set({ user: null, hydrated: true });
          return;
        }
      }
      set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  openAuth: (tab = 'login') => set({ authVisible: true, authTab: tab }),
  closeAuth: () => set({ authVisible: false }),
  setAuthTab: (tab) => set({ authTab: tab }),

  signIn: async (email, password) => {
    set({ pending: true });
    try {
      const res = await signInEmail(email, password);
      if (res.error || !res.user) {
        return res.error || 'Giriş başarısız';
      }
      set({ user: res.user, authVisible: false });
      return null;
    } finally {
      set({ pending: false });
    }
  },

  signUp: async (email, password, name) => {
    set({ pending: true });
    try {
      const res = await signUpEmail(email, password, name);
      if (res.error || !res.user) {
        return res.error || 'Kayıt başarısız';
      }
      set({ user: res.user, authVisible: false });
      return null;
    } finally {
      set({ pending: false });
    }
  },

  signOut: async () => {
    set({ pending: true });
    try {
      await apiSignOut();
      set({ user: null });
    } finally {
      set({ pending: false });
      get().closeAuth();
    }
  },
}));
