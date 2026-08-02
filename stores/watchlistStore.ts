import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ScannerItem } from '@/types/scanner';

type WatchlistState = {
  items: ScannerItem[];
  add: (item: ScannerItem) => void;
  remove: (symbol: string) => void;
  has: (symbol: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.some((i) => i.symbol === item.symbol)) return;
        set({ items: [item, ...get().items].slice(0, 50) });
      },
      remove: (symbol) =>
        set({ items: get().items.filter((i) => i.symbol !== symbol) }),
      has: (symbol) => get().items.some((i) => i.symbol === symbol),
    }),
    {
      name: 'bullsye-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
