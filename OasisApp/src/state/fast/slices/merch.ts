/**
 * Merch + N2O slice — MMKV-backed merch cart and N2O ticket state
 * N2OTickets is a number counter (matching old code's usage pattern)
 */
import type { StateCreator } from "zustand";

export interface MerchItem {
  id: number;
  name: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface MerchSlice {
  MerchCart: MerchItem[];
  N2OTickets: number;

  AddMerchToCart: (item: MerchItem) => void;
  RemoveMerchFromCart: (itemId: number) => void;
  ClearMerchCart: () => void;
  ClearUserMerchData: () => void;

  AddN2OTickets: (count?: number) => void;
  RemoveN2OTickets: (count?: number) => void;
  ClearN2OTickets: () => void;
}

export const createMerchSlice: StateCreator<MerchSlice, [], [], MerchSlice> = (
  set,
) => ({
  MerchCart: [],
  N2OTickets: 0,

  AddMerchToCart: (item) =>
    set((state) => ({
      MerchCart: [...state.MerchCart, item],
    })),

  RemoveMerchFromCart: (itemId) =>
    set((state) => ({
      MerchCart: state.MerchCart.filter((i) => i.id !== itemId),
    })),

  ClearMerchCart: () => set({ MerchCart: [] }),

  ClearUserMerchData: () => set({ MerchCart: [], N2OTickets: 0 }),

  AddN2OTickets: (count = 1) =>
    set((state) => ({
      N2OTickets: state.N2OTickets + count,
    })),

  RemoveN2OTickets: (count = 1) =>
    set((state) => ({
      N2OTickets: Math.max(0, state.N2OTickets - count),
    })),

  ClearN2OTickets: () => set({ N2OTickets: 0 }),
});
