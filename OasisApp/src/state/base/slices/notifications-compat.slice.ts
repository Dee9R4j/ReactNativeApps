/**
 * Notifications + search + compat slice — all additional BaseStore properties
 * referenced by old code that weren't in the core slices
 */
import type { StateCreator } from "zustand";
import { MOCK_NOTIFICATIONS, simulateNetworkDelay, type NotificationItem } from "@/api/dummyData";

export interface NotificationsCompatSlice {
  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  refreshUnreadCount: () => void;
  markAsRead: (id: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Orders compat
  ordersCurrentPage: number;
  ordersHasMore: boolean;
  isRefreshingOrders: boolean;
  isFetchingMoreOrders: boolean;
  isRefreshing: boolean;
  isCartLoading: boolean;
  menus: any[];
  initializeMenusForSearch: () => void;
  markOtpAsSeen: (orderId: number) => void;
  updateOrderStatus: (orderId: number, newStatus: number) => void;
}

export const createNotificationsCompatSlice: StateCreator<
  NotificationsCompatSlice,
  [],
  [],
  NotificationsCompatSlice
> = (set, get) => ({
  notifications: [],
  unreadCount: 0,
  searchQuery: "",
  ordersCurrentPage: 1,
  ordersHasMore: true,
  isRefreshingOrders: false,
  isFetchingMoreOrders: false,
  isRefreshing: false,
  isCartLoading: false,
  menus: [],

  fetchNotifications: async () => {
    await simulateNetworkDelay();
    const notifs = MOCK_NOTIFICATIONS;
    set({
      notifications: notifs,
      unreadCount: notifs.filter((n) => !n.is_read).length,
    });
  },

  refreshUnreadCount: () => {
    const { notifications } = get();
    set({ unreadCount: notifications.filter((n) => !n.is_read).length });
  },

  markAsRead: (id: number) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  setSearchQuery: (q: string) => set({ searchQuery: q }),

  initializeMenusForSearch: () => {
    console.log("[Mock] Menus initialized for search");
  },

  markOtpAsSeen: (orderId: number) => {
    console.log("[Mock] OTP marked as seen for order:", orderId);
  },

  updateOrderStatus: (orderId: number, newStatus: number) => {
    console.log("[Mock] Order", orderId, "status updated to:", newStatus);
  },
});
