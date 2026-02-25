/**
 * Base store — Zustand (no persistence, rehydrated from API/SQLite)
 * Combines all slices for backward compatibility with old screen code
 */
import { create } from "zustand";
import { createStallsSlice, type StallsSlice } from "./slices/stalls.slice";
import { createMenuSlice, type MenuSlice } from "./slices/menu.slice";
import { createOrdersSlice, type OrdersSlice } from "./slices/orders.slice";
import { createEventsSlice, type EventsSlice } from "./slices/events.slice";
import {
  createCartCompatSlice,
  type CartCompatSlice,
} from "./slices/cart-compat.slice";
import {
  createNotificationsCompatSlice,
  type NotificationsCompatSlice,
} from "./slices/notifications-compat.slice";

type BaseStore = StallsSlice &
  MenuSlice &
  OrdersSlice &
  EventsSlice &
  CartCompatSlice &
  NotificationsCompatSlice;

export const useBaseStore = create<BaseStore>()((...a) => ({
  ...createStallsSlice(...a),
  ...createMenuSlice(...a),
  ...createOrdersSlice(...a),
  ...createEventsSlice(...a),
  ...createCartCompatSlice(...a),
  ...createNotificationsCompatSlice(...a),
}));
