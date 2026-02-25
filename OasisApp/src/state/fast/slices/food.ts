/**
 * Food cart slice — MMKV-backed cart state
 * Manages cart items by stall, quantities, and active order tracking
 */
import type { StateCreator } from "zustand";
import type { Order } from "@/models/food.models";

// ==================== TYPES ====================
export interface CartItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  quantity: number;
}

export interface CartStallData {
  stallName: string;
  items: Record<string, CartItem>;
}

export type CartMap = Record<string, CartStallData>;
export type ActiveOrdersMap = Record<number, Order>;

export interface FoodSlice {
  // Cart state
  cart: CartMap;
  activeOrders: ActiveOrdersMap;

  // Cart actions
  addItem: (stallId: string, stallName: string, item: CartItem) => void;
  removeItem: (stallId: string, itemId: string) => void;
  clearStall: (stallId: string) => void;
  clearCart: () => void;

  // Active orders
  setActiveOrders: (orders: ActiveOrdersMap) => void;
  updateOrderStatus: (orderId: number, newStatus: number) => void;
}

// ==================== SELECTORS ====================
export const selectStallTotal = (
  state: FoodSlice,
  stallId: string,
): { items: number; totalPrice: number } => {
  const stall = state.cart[stallId];
  if (!stall) return { items: 0, totalPrice: 0 };

  let items = 0;
  let totalPrice = 0;
  Object.values(stall.items).forEach((item) => {
    items += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  return { items, totalPrice };
};

export const selectGlobalTotal = (
  state: FoodSlice,
): { items: number; totalPrice: number } => {
  let items = 0;
  let totalPrice = 0;

  Object.keys(state.cart).forEach((stallId) => {
    const stallTotal = selectStallTotal(state, stallId);
    items += stallTotal.items;
    totalPrice += stallTotal.totalPrice;
  });

  return { items, totalPrice };
};

export const selectCartItemCount = (state: FoodSlice): number => {
  return selectGlobalTotal(state).items;
};

// ==================== SLICE ====================
export const createFoodSlice: StateCreator<FoodSlice, [], [], FoodSlice> = (
  set,
) => ({
  cart: {},
  activeOrders: {},

  addItem: (stallId, stallName, item) =>
    set((state) => {
      const newCart = { ...state.cart };

      if (!newCart[stallId]) {
        newCart[stallId] = { stallName, items: {} };
      }

      if (item.quantity <= 0) {
        // Remove item
        const { [item.id]: _, ...remainingItems } = newCart[stallId].items;
        newCart[stallId] = { ...newCart[stallId], items: remainingItems };

        // Remove stall if empty
        if (Object.keys(newCart[stallId].items).length === 0) {
          const { [stallId]: __, ...remainingStalls } = newCart;
          return { cart: remainingStalls };
        }
      } else {
        newCart[stallId] = {
          ...newCart[stallId],
          items: {
            ...newCart[stallId].items,
            [item.id]: item,
          },
        };
      }

      return { cart: newCart };
    }),

  removeItem: (stallId, itemId) =>
    set((state) => {
      const newCart = { ...state.cart };
      if (!newCart[stallId]) return state;

      const { [itemId]: _, ...remainingItems } = newCart[stallId].items;
      newCart[stallId] = { ...newCart[stallId], items: remainingItems };

      if (Object.keys(newCart[stallId].items).length === 0) {
        const { [stallId]: __, ...remainingStalls } = newCart;
        return { cart: remainingStalls };
      }

      return { cart: newCart };
    }),

  clearStall: (stallId) =>
    set((state) => {
      const { [stallId]: _, ...remainingStalls } = state.cart;
      return { cart: remainingStalls };
    }),

  clearCart: () => set({ cart: {} }),

  setActiveOrders: (orders) => set({ activeOrders: orders }),

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => {
      const newOrders = { ...state.activeOrders };
      if (newOrders[orderId]) {
        newOrders[orderId] = { ...newOrders[orderId], status: newStatus };
      }
      return { activeOrders: newOrders };
    }),
});
