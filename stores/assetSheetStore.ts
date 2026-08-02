import { create } from 'zustand';
import type { ScannerItem } from '@/types/scanner';

type AssetSheetState = {
  asset: ScannerItem | null;
  open: (asset: ScannerItem) => void;
  close: () => void;
};

export const useAssetSheetStore = create<AssetSheetState>((set) => ({
  asset: null,
  open: (asset) => set({ asset }),
  close: () => set({ asset: null }),
}));
