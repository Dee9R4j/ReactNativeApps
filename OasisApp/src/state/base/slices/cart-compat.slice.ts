/**
 * Cart slice — cart operations on BaseStore for backward compatibility
 * The old code accesses cart via useBaseStore; new architecture has it in useFastStore.
 * This slice bridges the gap by providing the same API on BaseStore.
 */
import type { StateCreator } from "zustand";
import { placeOrder } from "@/api/food.api";
import type { OrderRequestVendor } from "@/utils/food-types";

export interface CartCompatSlice {
  cart: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  appOpError: string | null;

  initializeCart: () => Promise<void>;
  updateItemQuantity: (stallId: string, itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderData: OrderRequestVendor[]) => Promise<any>;
  clearAppOpError: () => void;
  setAxios: (instance: any) => void;
  axios: any;
}

export const createCartCompatSlice: StateCreator<
  CartCompatSlice,
  [],
  [],
  CartCompatSlice
> = (set, get) => ({
  cart: {},
  isLoading: false,
  error: null,
  appOpError: null,
  axios: { _mock: true } as any,

  initializeCart: async () => {
    // No-op in mock mode, cart is persisted in MMKV via FastStore
    console.log("[CartCompat] Cart initialized (mock)");
  },

  updateItemQuantity: (stallId, itemId, quantity) => {
    set((state) => {
      const newCart = { ...state.cart };
      if (newCart[stallId]) {
        if (quantity <= 0) {
          delete newCart[stallId][itemId];
          if (Object.keys(newCart[stallId]).length === 0) {
            delete newCart[stallId];
          }
        } else {
          newCart[stallId] = { ...newCart[stallId], [itemId]: quantity };
        }
      }
      return { cart: newCart };
    });
  },

  clearCart: () => set({ cart: {} }),

  placeOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await placeOrder(orderData);
      set({ isLoading: false, cart: {} });
      return result;
    } catch (err: any) {
      set({ isLoading: false, error: "Failed to place order" });
      throw err;
    }
  },

  clearAppOpError: () => set({ appOpError: null }),

  setAxios: (instance) => set({ axios: instance }),
});
