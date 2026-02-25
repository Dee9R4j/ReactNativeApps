/**
 * Stub split store — placeholder for split bill feature
 */
import { create } from "zustand";

interface SplitState {
  splitFriends: any[];
  splitBill: any | null;
  selectedOrders: any[];
  splitId: string | null;
  setSplitFriends: (friends: any[]) => void;
  setSplitBill: (bill: any) => void;
  setSelectedOrders: (orders: any[]) => void;
  clearSplit: () => void;
}

export const useSplitStore = create<SplitState>((set) => ({
  splitFriends: [],
  splitBill: null,
  selectedOrders: [],
  splitId: null,
  setSplitFriends: (friends) => set({ splitFriends: friends }),
  setSplitBill: (bill) => set({ splitBill: bill }),
  setSelectedOrders: (orders) => set({ selectedOrders: orders }),
  clearSplit: () => set({ splitFriends: [], splitBill: null, selectedOrders: [] }),
}));
