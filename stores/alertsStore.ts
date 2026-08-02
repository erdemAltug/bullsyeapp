import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AlertKind, PriceAlert } from '@/types';

type AlertsState = {
  alerts: PriceAlert[];
  add: (input: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
  remove: (id: string) => void;
  toggleTriggered: (id: string) => void;
};

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      add: (input) => {
        const alert: PriceAlert = {
          ...input,
          id: `${input.symbol}-${Date.now()}`,
          triggered: false,
          createdAt: new Date().toISOString(),
        };
        set({ alerts: [alert, ...get().alerts] });
      },
      remove: (id) =>
        set({ alerts: get().alerts.filter((a) => a.id !== id) }),
      toggleTriggered: (id) =>
        set({
          alerts: get().alerts.map((a) =>
            a.id === id ? { ...a, triggered: !a.triggered } : a
          ),
        }),
    }),
    {
      name: 'bullsye-alerts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export type { AlertKind };
