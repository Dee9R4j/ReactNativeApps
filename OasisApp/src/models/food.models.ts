/**
 * Food domain models — stalls, menus, cart, orders
 */
import { placeOrder } from "@/api/food.api";

// ==================== STALL ====================
export interface Stall {
  id: number;
  name: string;
  image_url: string;
  image_background_color: string;
  location: string;
  description: string;
  closed: boolean;
}

// ==================== MENU ITEM ====================
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  description: string;
}

// ==================== ORDER ====================
// Re-export Order from food-types to have a single source of truth
export type { OrderItem, Order } from "@/utils/food-types";

export enum OrderStatus {
  PENDING = 0,
  ACCEPTED = 1,
  PREPARING = 2,
  READY = 3,
  COMPLETED = 4,
  CANCELLED = 5,
}

// ==================== CART ====================
export interface CartStall {
  id: string;
  name: string;
  items: CartMenuItem[];
}

export interface CartMenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  quantity: number;
}

// ==================== ORDER REQUEST ====================
export interface OrderRequestItem {
  menu_item: number;
  quantity: number;
}

export interface OrderRequestVendor {
  vendor: number;
  items: OrderRequestItem[];
}

/**
 * Build order request data from cart stalls
 */
export function buildOrderRequestData(
  cartStalls: CartStall[],
): OrderRequestVendor[] {
  return cartStalls.map((stall) => ({
    vendor: Number(stall.id),
    items: stall.items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        menu_item: Number(item.id),
        quantity: item.quantity,
      })),
  }));
}

/**
 * API namespace for food operations
 */
export const api = {
  placeOrder,
};
