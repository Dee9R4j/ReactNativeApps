/**
 * Dummy data for testing UI without a real backend
 * All mock records, mutable state, and network delay simulation
 */
import { mmkvStorage } from "@/state/fast/mmkv";

// ==================== NETWORK SIMULATION ====================

export const simulateNetworkDelay = (
  minMs: number = 200,
  maxMs: number = 800,
): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// ==================== AUTH DATA ====================

export const MOCK_CREDENTIALS = {
  username: "test1",
  password: "testing321",
};

export const MOCK_USER_DATA = {
  access: "mock_jwt_token_oasis_2025_testing_only_12345",
  refresh: "mock_refresh_token_oasis_2025_testing_only_67890",
  user_id: 1001,
  qr_code:
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=OASIS2025_USER_1001",
  name: "Test User",
  email: "test1@bits-oasis.org",
  phone: "+91 9876543210",
  referral_code: "OASIS2025TEST",
  bitsian_id: "2021A7PS0001G",
  fcm_token: "mock_fcm_token",
  photo: "https://ui-avatars.com/api/?name=Test+User&background=random",
};

// ==================== FOOD STALLS ====================

export const MOCK_STALLS = [
  {
    id: 1,
    name: "Pizza Palace",
    image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    image_background_color: "#E74C3C",
    location: "Food Court A, Stall 1",
    description: "Best pizzas in town with authentic Italian recipes",
    closed: false,
  },
  {
    id: 2,
    name: "Burger Barn",
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    image_background_color: "#F39C12",
    location: "Food Court A, Stall 2",
    description: "Juicy burgers with secret sauce",
    closed: false,
  },
  {
    id: 3,
    name: "Desi Tadka",
    image_url:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    image_background_color: "#27AE60",
    location: "Food Court B, Stall 1",
    description: "Authentic Indian cuisine",
    closed: false,
  },
  {
    id: 4,
    name: "Noodle House",
    image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    image_background_color: "#9B59B6",
    location: "Food Court B, Stall 2",
    description: "Chinese and Thai specialties",
    closed: false,
  },
  {
    id: 5,
    name: "Chai Point",
    image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    image_background_color: "#8B4513",
    location: "Food Court C, Stall 1",
    description: "Refreshing beverages and snacks",
    closed: false,
  },
  {
    id: 6,
    name: "Ice Cream Corner",
    image_url:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400",
    image_background_color: "#FF69B4",
    location: "Food Court C, Stall 2",
    description: "Cool treats and desserts",
    closed: true,
  },
];

// ==================== MENU ITEMS ====================

export const MOCK_MENUS: Record<number, any[]> = {
  1: [
    { id: 101, name: "Margherita Pizza", price: 199, is_veg: true, is_available: true, description: "Classic cheese pizza with tomato sauce" },
    { id: 102, name: "Pepperoni Pizza", price: 299, is_veg: false, is_available: true, description: "Loaded with spicy pepperoni" },
    { id: 103, name: "Veggie Supreme", price: 249, is_veg: true, is_available: true, description: "Bell peppers, olives, mushrooms" },
    { id: 104, name: "BBQ Chicken Pizza", price: 349, is_veg: false, is_available: true, description: "Smoky BBQ chicken with onions" },
    { id: 105, name: "Paneer Tikka Pizza", price: 279, is_veg: true, is_available: false, description: "Spicy paneer with tandoori flavors" },
    { id: 106, name: "Garlic Bread", price: 99, is_veg: true, is_available: true, description: "Crispy bread with garlic butter" },
  ],
  2: [
    { id: 201, name: "Classic Burger", price: 149, is_veg: false, is_available: true, description: "Beef patty with lettuce and tomato" },
    { id: 202, name: "Veggie Burger", price: 129, is_veg: true, is_available: true, description: "Crispy vegetable patty" },
    { id: 203, name: "Cheese Burst Burger", price: 179, is_veg: false, is_available: true, description: "Double cheese with crispy bacon" },
    { id: 204, name: "Paneer Burger", price: 139, is_veg: true, is_available: true, description: "Grilled paneer with mint sauce" },
    { id: 205, name: "French Fries", price: 79, is_veg: true, is_available: true, description: "Crispy golden fries" },
    { id: 206, name: "Chicken Wings", price: 199, is_veg: false, is_available: true, description: "Spicy buffalo wings" },
  ],
  3: [
    { id: 301, name: "Butter Chicken", price: 249, is_veg: false, is_available: true, description: "Creamy tomato-based curry" },
    { id: 302, name: "Paneer Butter Masala", price: 199, is_veg: true, is_available: true, description: "Rich paneer curry" },
    { id: 303, name: "Dal Makhani", price: 149, is_veg: true, is_available: true, description: "Creamy black lentils" },
    { id: 304, name: "Chicken Biryani", price: 229, is_veg: false, is_available: true, description: "Aromatic rice with spiced chicken" },
    { id: 305, name: "Veg Biryani", price: 179, is_veg: true, is_available: true, description: "Fragrant rice with vegetables" },
    { id: 306, name: "Naan", price: 39, is_veg: true, is_available: true, description: "Soft Indian bread" },
    { id: 307, name: "Raita", price: 49, is_veg: true, is_available: true, description: "Cooling yogurt side" },
  ],
  4: [
    { id: 401, name: "Hakka Noodles", price: 149, is_veg: true, is_available: true, description: "Stir-fried with vegetables" },
    { id: 402, name: "Chicken Chow Mein", price: 179, is_veg: false, is_available: true, description: "Classic Chinese noodles" },
    { id: 403, name: "Pad Thai", price: 199, is_veg: true, is_available: true, description: "Thai rice noodles" },
    { id: 404, name: "Manchurian", price: 159, is_veg: true, is_available: true, description: "Indo-Chinese favorite" },
    { id: 405, name: "Spring Rolls", price: 99, is_veg: true, is_available: true, description: "Crispy vegetable rolls" },
    { id: 406, name: "Dim Sum", price: 129, is_veg: true, is_available: false, description: "Steamed dumplings" },
  ],
  5: [
    { id: 501, name: "Masala Chai", price: 39, is_veg: true, is_available: true, description: "Spiced Indian tea" },
    { id: 502, name: "Cold Coffee", price: 89, is_veg: true, is_available: true, description: "Chilled coffee with ice cream" },
    { id: 503, name: "Lemon Iced Tea", price: 69, is_veg: true, is_available: true, description: "Refreshing citrus drink" },
    { id: 504, name: "Samosa", price: 29, is_veg: true, is_available: true, description: "Crispy potato pastry" },
    { id: 505, name: "Sandwich", price: 79, is_veg: true, is_available: true, description: "Grilled cheese sandwich" },
    { id: 506, name: "Pakora", price: 49, is_veg: true, is_available: true, description: "Fried vegetable fritters" },
  ],
  6: [
    { id: 601, name: "Vanilla Scoop", price: 59, is_veg: true, is_available: true, description: "Classic vanilla ice cream" },
    { id: 602, name: "Chocolate Sundae", price: 129, is_veg: true, is_available: true, description: "Rich chocolate with toppings" },
    { id: 603, name: "Mango Kulfi", price: 79, is_veg: true, is_available: true, description: "Traditional Indian frozen dessert" },
    { id: 604, name: "Brownie with Ice Cream", price: 149, is_veg: true, is_available: true, description: "Warm brownie with vanilla" },
  ],
};

// ==================== ORDERS ====================

let mockOrderIdCounter = 6000;

export const generateMockOrder = (
  vendorId: number,
  items: any[],
  status: number = 0,
) => {
  const vendor = MOCK_STALLS.find((s) => s.id === vendorId);
  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.unit_price * item.quantity,
    0,
  );

  return {
    id: ++mockOrderIdCounter,
    vendor: vendorId,
    vendor_name: vendor?.name || "Unknown Vendor",
    vendor_image: vendor?.image_url,
    vendor_image_background_color: vendor?.image_background_color,
    items,
    status,
    price: totalPrice,
    amount: totalPrice,
    otp: Math.floor(1000 + Math.random() * 9000),
    otp_seen: false,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

export const MOCK_ORDERS = [
  {
    id: 5001,
    vendor: 1,
    vendor_name: "Pizza Palace",
    vendor_image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    vendor_image_background_color: "#E74C3C",
    items: [
      { id: 1, menu_item: 101, name: "Margherita Pizza", quantity: 2, unit_price: 199, is_veg: true, total_price: 398 },
      { id: 2, menu_item: 106, name: "Garlic Bread", quantity: 1, unit_price: 99, is_veg: true, total_price: 99 },
    ],
    status: 3,
    price: 497,
    amount: 497,
    otp: 1234,
    otp_seen: false,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 5002,
    vendor: 3,
    vendor_name: "Desi Tadka",
    vendor_image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    vendor_image_background_color: "#27AE60",
    items: [
      { id: 3, menu_item: 302, name: "Paneer Butter Masala", quantity: 1, unit_price: 199, is_veg: true, total_price: 199 },
      { id: 4, menu_item: 306, name: "Naan", quantity: 2, unit_price: 39, is_veg: true, total_price: 78 },
    ],
    status: 1,
    price: 277,
    amount: 277,
    otp: 5678,
    otp_seen: false,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 5003,
    vendor: 2,
    vendor_name: "Burger Barn",
    vendor_image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    vendor_image_background_color: "#F39C12",
    items: [
      { id: 5, menu_item: 201, name: "Classic Burger", quantity: 1, unit_price: 149, is_veg: false, total_price: 149 },
    ],
    status: 4,
    price: 149,
    amount: 149,
    otp: 9012,
    otp_seen: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
];

// Mutable orders for simulating placement
const MOCK_ORDERS_KEY = "dummy_mock_orders_v1";
export let currentMockOrders = [...MOCK_ORDERS];

try {
  const stored = mmkvStorage.getString(MOCK_ORDERS_KEY);
  if (stored) {
    currentMockOrders = JSON.parse(stored);
  }
} catch (e) {
  console.error("Failed to load mock orders from MMKV", e);
}

// Adjust counter to prevent duplicate keys
if (currentMockOrders.length > 0) {
  const maxId = Math.max(...currentMockOrders.map(o => o.id));
  if (maxId >= mockOrderIdCounter) {
    mockOrderIdCounter = maxId + 1;
  }
}

export const addMockOrder = (order: any) => {
  currentMockOrders = [order, ...currentMockOrders];
  try {
    mmkvStorage.set(MOCK_ORDERS_KEY, JSON.stringify(currentMockOrders));
  } catch (e) {
    console.error("Failed to save mock orders to MMKV", e);
  }
  return order;
};

export const updateMockOrderStatus = (orderId: number, newStatus: number) => {
  currentMockOrders = currentMockOrders.map((o) =>
    o.id === orderId ? { ...o, status: newStatus } : o,
  );
};





// ==================== SHOWS ====================

export const MOCK_PROF_SHOWS = [
  { id: 1, name: "DJ Snake Live", artist: "DJ Snake", date_time: "2026-01-23T20:00:00", venue: "Main Stage", description: "International DJ bringing the beats!", image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", ticket_price: 500, available_seats: 1000 },
  { id: 2, name: "Arijit Singh Concert", artist: "Arijit Singh", date_time: "2026-01-24T20:00:00", venue: "Main Stage", description: "Soulful melodies from India's favorite singer", image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", ticket_price: 750, available_seats: 500 },
  { id: 3, name: "Comedy Night with Zakir Khan", artist: "Zakir Khan", date_time: "2026-01-25T19:00:00", venue: "Auditorium A", description: "An evening of laughter and stories", image_url: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400", ticket_price: 300, available_seats: 800 },
];

// ==================== MERCH ====================

export const MOCK_MERCH = [
  { id: 1, name: "Oasis 2025 T-Shirt", price: 499, description: "Official festival t-shirt with unique design", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Navy"], in_stock: true, back_image_url: "" },
  { id: 2, name: "Oasis Cap", price: 299, description: "Stylish cap with embroidered logo", image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", sizes: ["One Size"], colors: ["Black", "White"], in_stock: true, back_image_url: "" },
  { id: 3, name: "Hoodie", price: 999, description: "Comfortable hoodie for cold nights", image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Grey"], in_stock: true, back_image_url: "" },
];

// ==================== WALLET ====================

export const MOCK_WALLET = {
  balance: 2500,
  transactions: [
    { id: 1, type: "credit" as const, amount: 1000, description: "Added cash", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString() },
    { id: 2, type: "debit" as const, amount: 497, description: "Order #5001 - Pizza Palace", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: 3, type: "debit" as const, amount: 277, description: "Order #5002 - Desi Tadka", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
    { id: 4, type: "credit" as const, amount: 2000, description: "Added cash", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString() },
  ],
};

// ==================== NOTIFICATIONS ====================

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  order_id: number | null;
  new_status: number | null;
  old_status: number | null;
  is_read: boolean;
  created_at: string;
  url?: string | null;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: "Order Ready!", message: "Your order #5001 from Pizza Palace is ready for pickup!", type: "order_status", order_id: 5001, new_status: 3, old_status: 2, is_read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString(), url: "/private/tabs/food/orders" },
  { id: 2, title: "New Event Alert", message: "Don't miss the DJ Night at Main Stage tonight at 8 PM!", type: "event", order_id: null, new_status: null, old_status: null, is_read: false, created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(), url: "/private/tabs/events" },
  { id: 3, title: "Order Accepted", message: "Your order #5002 from Desi Tadka has been accepted.", type: "order_status", order_id: 5002, new_status: 1, old_status: 0, is_read: true, created_at: new Date(Date.now() - 20 * 60000).toISOString(), url: "/private/tabs/food/orders" },
  { id: 4, title: "Welcome to Oasis 2025!", message: "Thank you for joining us. Explore events, order food, and have a great time!", type: "general", order_id: null, new_status: null, old_status: null, is_read: true, created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString(), url: null },
];

// ==================== WALLET (EXPANDED) ====================

export const MOCK_WALLET_BALANCE = { total: 2500 };

export const MOCK_WALLET_TRANSACTIONS = [
  { id: 1, name: "Added via UPI", amount: 1000, txn_type: 0, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString() },
  { id: 2, name: "Order #5001 - Pizza Palace", amount: 497, txn_type: 1, timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 3, name: "Order #5002 - Desi Tadka", amount: 277, txn_type: 1, timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 4, name: "Added via UPI", amount: 2000, txn_type: 0, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString() },
  { id: 5, name: "Received Money", amount: 500, txn_type: 7, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString() },
  { id: 6, name: "T-Shirt Purchase", amount: 499, txn_type: 1, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString() },
  { id: 7, name: "Sent to Rahul", amount: 200, txn_type: 2, timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString() },
];

export const MOCK_KIND_STORE = [
  { id: 1, name: "Free Water Bottle", kind_points: 50, image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200", available: true },
  { id: 2, name: "Oasis Sticker Pack", kind_points: 30, image_url: "https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=200", available: true },
  { id: 3, name: "Free Chai Coupon", kind_points: 20, image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200", available: true },
  { id: 4, name: "Tote Bag", kind_points: 100, image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200", available: false },
];

// ==================== SPONSORS ====================

export interface Sponsor {
  id: number;
  name: string;
  url: string | null;
  description?: string | null;
  web_url?: string | null;
  order_no?: number;
}

export const MOCK_SPONSORS: Sponsor[] = [
  { id: 1, name: "Red Bull", url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", description: "Energy Partner", web_url: "https://redbull.com", order_no: 1 },
  { id: 2, name: "Coca-Cola", url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300", description: "Beverage Partner", web_url: "https://coca-cola.com", order_no: 2 },
  { id: 3, name: "Spotify", url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300", description: "Music Partner", web_url: "https://spotify.com", order_no: 3 },
  { id: 4, name: "Samsung", url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", description: "Tech Partner", web_url: "https://samsung.com", order_no: 4 },
  { id: 5, name: "Zomato", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300", description: "Food Partner", web_url: "https://zomato.com", order_no: 5 },
  { id: 6, name: "Myntra", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300", description: "Fashion Partner", web_url: "https://myntra.com", order_no: 6 },
];

// ==================== SPLITS / FRIENDS ====================

export interface Friend {
  id: number;
  name: string;
  user_id: number;
  photo: string;
}

export const MOCK_FRIENDS: Friend[] = [
  { id: 1, name: "Aarav Patel", user_id: 1002, photo: "https://ui-avatars.com/api/?name=Aarav+Patel&background=random" },
  { id: 2, name: "Priya Sharma", user_id: 1003, photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=random" },
  { id: 3, name: "Rohan Gupta", user_id: 1004, photo: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=random" },
  { id: 4, name: "Ananya Singh", user_id: 1005, photo: "https://ui-avatars.com/api/?name=Ananya+Singh&background=random" },
];

export interface SplitRecord {
  id: number;
  order_id: number;
  total_amount: number;
  split_with: { user_id: number; name: string; share: number; status: string }[];
  status: string;
  created_at: string;
}

export const MOCK_SPLITS: SplitRecord[] = [
  {
    id: 1, order_id: 5001, total_amount: 497,
    split_with: [
      { user_id: 1002, name: "Aarav Patel", share: 249, status: "paid" },
      { user_id: 1001, name: "Test User", share: 248, status: "paid" },
    ],
    status: "completed", created_at: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: 2, order_id: 5002, total_amount: 277,
    split_with: [
      { user_id: 1003, name: "Priya Sharma", share: 139, status: "pending" },
      { user_id: 1001, name: "Test User", share: 138, status: "paid" },
    ],
    status: "pending", created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
];

export const MOCK_FRIEND_REQUEST_URL = "https://oasis.example.com/friends/add?token=mock_token_12345";

// ==================== GALLERY ====================

export const MOCK_GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600", caption: "Opening Ceremony" },
  { id: 2, url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", caption: "DJ Night" },
  { id: 3, url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600", caption: "Main Stage" },
  { id: 4, url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600", caption: "Dance Competition" },
  { id: 5, url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600", caption: "Concert Night" },
  { id: 6, url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600", caption: "Crowd Vibes" },
  { id: 7, url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600", caption: "Light Show" },
  { id: 8, url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600", caption: "Festival Lights" },
];

// ==================== POSTER ====================

export const MOCK_POSTER_IMAGE = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600";

// ==================== EVENTS ====================

export const MOCK_EVENT_CATEGORIES = [
  "Dance",
  "Music",
  "Drama",
  "Art",
  "Coding",
  "Photography",
];

export const MOCK_EVENTS = [
  { id: 1, name: "Opening Ceremony", date_time: "2025-11-07T10:00:00", description: "Grand opening of Oasis 2025 with special performances and guest speakers.", categories: ["Cultural", "Featured"], venue_name: "Main Auditorium", organiser: "Cultural Committee", bookmark: false, is_live: false },
  { id: 2, name: "Battle of Bands", date_time: "2025-11-07T16:00:00", description: "Watch college bands compete for the ultimate title!", categories: ["Music", "Competition"], venue_name: "Open Air Theatre", organiser: "Music Club", bookmark: true, is_live: true },
  { id: 3, name: "DJ Night feat. DJ Snake", date_time: "2025-11-08T20:00:00", description: "International artist DJ Snake performing live!", categories: ["Music", "Featured", "ProNight"], venue_name: "Main Stage", organiser: "Events Team", bookmark: true, is_live: true },
  { id: 4, name: "Hackathon Kickoff", date_time: "2025-11-09T09:00:00", description: "24-hour coding challenge begins. Build something amazing!", categories: ["Tech", "Competition"], venue_name: "Computer Center", organiser: "Tech Club", bookmark: false, is_live: false },
  { id: 5, name: "Stand-up Comedy Night", date_time: "2025-11-10T19:00:00", description: "Laugh out loud with top comedians performing live.", categories: ["Cultural", "Entertainment"], venue_name: "Auditorium B", organiser: "Entertainment Committee", bookmark: false, is_live: false },
  { id: 6, name: "Dance Competition Finals", date_time: "2025-11-11T15:00:00", description: "Watch the best dance crews battle it out!", categories: ["Dance", "Competition", "Featured"], venue_name: "Main Stage", organiser: "Dance Club", bookmark: true, is_live: true },
  { id: 7, name: "Closing Ceremony", date_time: "2025-11-11T21:00:00", description: "Grand finale with prize distribution and special performances.", categories: ["Cultural", "Featured"], venue_name: "Main Auditorium", organiser: "Fest Committee", bookmark: false, is_live: false },
];
