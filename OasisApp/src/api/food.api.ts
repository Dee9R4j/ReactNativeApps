/**
 * Mock Food API — uses dummyData for UI testing
 * Replaces real axios-based API calls with simulated responses
 */
import {
  MOCK_STALLS,
  MOCK_MENUS,
  MOCK_ORDERS,
  currentMockOrders,
  addMockOrder,
  generateMockOrder,
  simulateNetworkDelay,
} from "./dummyData";
import { OrderRequestVendor } from "@/utils/food-types";

const ORDERS_PAGE_LIMIT = 10;

// ============================================
// STALLS
// ============================================
export const getStalls = async () => {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_STALLS };
};

// ============================================
// MENU
// ============================================
export const getMenu = async (vendorId: number) => {
  await simulateNetworkDelay();
  const menu = MOCK_MENUS[vendorId] || [];
  return { success: true, data: menu };
};

// ============================================
// ORDERS
// ============================================
export const getOrders = async (page: number, limit: number = ORDERS_PAGE_LIMIT) => {
  await simulateNetworkDelay();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = currentMockOrders.slice(startIndex, endIndex);

  return {
    success: true,
    data: { orders: paginatedOrders },
  };
};

// ============================================
// PLACE ORDER
// ============================================
export const placeOrder = async (orderData: OrderRequestVendor[]) => {
  await simulateNetworkDelay(500, 1500);

  const createdOrders = orderData.map((order) => {
    const menuItems = MOCK_MENUS[order.vendor] || [];
    const items = order.items.map((item) => {
      const menuItem = menuItems.find((m: any) => m.id === item.itemclass_id);
      return {
        id: Math.floor(Math.random() * 10000),
        menu_item: item.itemclass_id,
        name: menuItem?.name || "Unknown Item",
        quantity: item.quantity,
        unit_price: menuItem?.price || 0,
        is_veg: menuItem?.is_veg || false,
        total_price: (menuItem?.price || 0) * item.quantity,
      };
    });

    const newOrder = generateMockOrder(order.vendor, items, 0);
    addMockOrder(newOrder);
    return newOrder;
  });

  return { success: true, data: { orders: createdOrders } };
};

// ============================================
// OTP
// ============================================
export const seeOtp = async (orderId: number) => {
  await simulateNetworkDelay(100, 300);
  return {
    success: true,
    data: { detail: "OTP: 1234" } as Record<string, string>,
    errorMessage: undefined as string | undefined,
  };
};
