import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PortfolioPosition } from '@/types';

type PortfolioState = {
  positions: PortfolioPosition[];
  add: (pos: Omit<PortfolioPosition, 'id'>) => void;
  remove: (id: string) => void;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      positions: [],
      add: (pos) =>
        set({
          positions: [
            { ...pos, id: `${pos.symbol}-${Date.now()}` },
            ...get().positions,
          ],
        }),
      remove: (id) =>
        set({ positions: get().positions.filter((p) => p.id !== id) }),
    }),
    {
      name: 'bullsye-portfolio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function computePortfolioHealth(
  positions: PortfolioPosition[]
): { score: number; label: string; findings: string[] } {
  if (!positions.length) {
    return {
      score: 0,
      label: 'Boş portföy',
      findings: ['En az bir pozisyon ekleyerek sağlık skorunu hesaplayın.'],
    };
  }

  const classes = new Set(positions.map((p) => p.assetClass));
  let score = 40 + classes.size * 15;
  const findings: string[] = [];

  if (classes.size === 1) {
    score -= 15;
    findings.push('Tek varlık sınıfına yoğunlaşma — çeşitlendirin.');
  }
  if (positions.length >= 5) {
    score += 10;
    findings.push('Pozisyon sayısı makul dağılım sağlıyor.');
  } else {
    findings.push('Daha fazla pozisyon ekleyerek riski dağıtın.');
  }

  score = Math.min(95, Math.max(10, score));
  const label =
    score >= 75 ? 'Sağlıklı' : score >= 50 ? 'Orta risk' : 'Yüksek yoğunlaşma';

  return { score, label, findings };
}
