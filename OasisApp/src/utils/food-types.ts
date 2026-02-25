export interface OrdersContextType {
  search: string;
  setSearch: (search: string) => void;
  filter: string[];
  setFilter: (filter: string[]) => void;
  loading: boolean;
  isRefreshingOrders: boolean;
  isFetchingMoreOrders: boolean;
  ordersHasMore: boolean;
  onRefresh: () => void;
  loadMoreOrders: () => void;
  handleOtpSeen: (orderId: number, otp?: number) => void;
  filteredOrders: Order[];
  error: string | null;
}
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  is_veg: boolean;
  total_price: number;
}

export interface Order {
  id: number;
  vendor_name: string;
  vendor_image?: string;
  vendor_image_background_color?: string;
  items: OrderItem[];
  transaction_id: number | null;
  status: number;
  price: number;
  otp: number;
  otp_seen: boolean;
  timestamp: string;
  is_split: boolean;
}

export interface OrderWithSplitStatus extends Order {
  is_split: boolean;
}

export interface Stall {
  id: number;
  name: string;
  image_url: string;
  image_background_color?: string;
  location: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  image_url?: string;
  image_background_color?: string;
}

export interface OrderRequestItem {
  itemclass_id: number;
  quantity: number;
}

export interface OrderRequestVendor {
  vendor: number;
  items: OrderRequestItem[];
}

export interface OrderRequest {
  orders: OrderRequestVendor[];
}

export interface OrderResponseItem {
  id: number;
  name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  is_veg: boolean;
}

export interface OrderResponseVendor {
  vendor: number;
  items: OrderResponseItem[];
}

export interface OrderResponse {
  orders: OrderResponseVendor[];
  timestamp: string;
}

export interface CartMenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
}

export interface CartItem extends CartMenuItem {
  quantity: number;
}

export interface StallInfo {
  id: string;
  name: string;
}

export interface CartStall {
  id: string;
  name: string;
  items: CartItem[];
}

export type CartState = Record<string, CartStall>;

export interface StallTotal {
  stallId: string;
  stallName: string;
  totalItems: number;
  totalAmount: number;
}
