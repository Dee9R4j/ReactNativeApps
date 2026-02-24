/**
 * API Endpoints
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    GOOGLE: "/auth/google",
    LOGOUT: "/auth/logout",
  },
  FOOD: {
    STALLS: "/food/stalls",
    MENU: (stallId: number) => `/food/stalls/${stallId}/menu`,
    ORDERS: "/food/orders",
    PLACE_ORDER: "/food/orders/place",
    SEE_OTP: (orderId: number) => `/food/orders/${orderId}/see-otp`,
  },
  EVENTS: {
    LIST: "/events",
    CATEGORIES: "/events/categories",
    BY_DATE: (date: string) => `/events?date=${date}`,
    BY_ID: (id: number) => `/events/${id}`,
  },
  SHOWS: {
    LIST: "/shows",
  },
  MERCH: {
    LIST: "/merch",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    SUBSCRIBE: "/notifications/subscribe",
  },
} as const;
