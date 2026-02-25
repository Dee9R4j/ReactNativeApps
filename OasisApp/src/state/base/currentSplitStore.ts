/**
 * Stub current split store — placeholder for active split session
 */
import { create } from "zustand";

interface CurrentSplitState {
  currentSplit: any | null;
  splitId: string | null;
  setCurrentSplit: (split: any) => void;
  setSplitId: (id: string | number | null) => void;
  clearCurrentSplit: () => void;
}

export const useCurrentSplitStore = create<CurrentSplitState>((set) => ({
  currentSplit: null,
  splitId: null,
  setCurrentSplit: (split) => set({ currentSplit: split }),
  setSplitId: (id) => set({ splitId: id != null ? String(id) : null }),
  clearCurrentSplit: () => set({ currentSplit: null, splitId: null }),
}));
