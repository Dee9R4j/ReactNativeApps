/**
 * Orders slice — fetches and manages order history
 */
import type { StateCreator } from "zustand";
import type { Order } from "@/models/food.models";
import { getOrders } from "@/api/food.api";

export interface OrdersSlice {
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  ordersPage: number;
  hasMoreOrders: boolean;

  fetchOrders: (params: {
    page: number;
    isRefresh?: boolean;
    force?: boolean;
  }) => Promise<void>;
  clearOrders: () => void;
}

export const createOrdersSlice: StateCreator<
  OrdersSlice,
  [],
  [],
  OrdersSlice
> = (set, get) => ({
  orders: [],
  isLoadingOrders: false,
  ordersError: null,
  ordersPage: 1,
  hasMoreOrders: true,

  fetchOrders: async ({ page, isRefresh = false, force = false }) => {
    const { isLoadingOrders, orders } = get();
    if (isLoadingOrders && !force) return;

    set({ isLoadingOrders: true, ordersError: null });
    try {
      const result = await getOrders(page);
      if (result.success && result.data) {
        const newOrders = result.data.orders as unknown as Order[];
        set({
          orders: isRefresh ? newOrders : [...orders, ...newOrders],
          ordersPage: page,
          hasMoreOrders: newOrders.length >= 10,
          isLoadingOrders: false,
        });
      } else {
        set({ ordersError: "Failed to fetch orders", isLoadingOrders: false });
      }
    } catch (error: any) {
      set({
        ordersError: "Network error fetching orders",
        isLoadingOrders: false,
      });
    }
  },

  clearOrders: () => {
    set({ orders: [], ordersPage: 1, hasMoreOrders: true });
  },
});
