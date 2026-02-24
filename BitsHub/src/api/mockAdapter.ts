// src/api/mockAdapter.ts
import { createMMKV } from "react-native-mmkv";
import { dummyEvents, dummySlots, dummyTicketTypes } from "./mockData";

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

type MockBooking = {
  id: string;
  user_id: string;
  event_id: number;
  event_title?: string;
  event_details?: string;
  slot_id: number;
  ticket_type_id: number;
  quantity: number;
  qrCode: string;
  status: "CONFIRMED" | "CANCELLED";
  purchasedAt: string;
  booked_at?: string;
};

type MockDb = {
  events: any[];
  slots: any[];
  ticketTypes: any[];
  bookings: MockBooking[];
};

const MOCK_DB_KEY = "mock-backend-db-v1";
const mockDbStorage = createMMKV({ id: "mock-backend-storage" });

const seedDb = (): MockDb => ({
  events: [...dummyEvents],
  slots: [...dummySlots],
  ticketTypes: [...dummyTicketTypes],
  bookings: [],
});

const getDb = (): MockDb => {
  const raw = mockDbStorage.getString(MOCK_DB_KEY);
  if (!raw) {
    const seeded = seedDb();
    mockDbStorage.set(MOCK_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as MockDb;
  } catch {
    const seeded = seedDb();
    mockDbStorage.set(MOCK_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const setDb = (db: MockDb) => {
  mockDbStorage.set(MOCK_DB_KEY, JSON.stringify(db));
};

const normalizeUserKey = (value?: string) =>
  (value || "dummydemouser").trim().toLowerCase().replace(/\s+/g, "_");

export const mockApi = {
  // --- AUTH ---
  login: async (username?: string, password?: string) => {
    await delay(800);
    // Hardcoded admin check according to user request
    if (username === "admin1" && password === "testing321") {
      return {
        success: true,
        accessToken: "mocked_admin_access_token",
        refreshToken: "mocked_admin_refresh",
        userID: "admin_123",
        admin: true,
        username: "admin1",
      };
    }
    // Any other credentials bypass as Standard User for dummy testing
    const normalizedUsername = normalizeUserKey(username);
    return {
      success: true,
      accessToken: "mocked_user_access_token",
      refreshToken: "mocked_user_refresh",
      userID: `user_${normalizedUsername}`,
      admin: false,
      username: username || "dummyUser",
    };
  },

  // --- EVENTS (USER & ADMIN) ---
  getEvents: async () => {
    await delay(500);
    const db = getDb();
    return { success: true, data: [...db.events] };
  },

  getEventDetails: async (eventId: number) => {
    await delay(500);
    const db = getDb();
    const event = db.events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const slots = db.slots.filter((s) => s.event_id === eventId);
    const tickets = db.ticketTypes.filter((t) => t.event_id === eventId);

    return {
      success: true,
      data: {
        ...event,
        slots,
        ticketTypes: tickets,
      },
    };
  },

  // --- BOOKINGS ---
  buyTicket: async (
    userId: string,
    eventId: number,
    slotId: number,
    ticketTypeId: number,
    quantity: number,
  ) => {
    await delay(800);
    const db = getDb();
    const event = db.events.find((item) => item.id === eventId);

    const booking: MockBooking = {
      id: "booking_" + generateId(),
      user_id: userId,
      event_id: eventId,
      event_title: event?.title || `Event ${eventId}`,
      event_details: event?.description || "",
      slot_id: slotId,
      ticket_type_id: ticketTypeId,
      quantity,
      qrCode: "QR_" + generateId(),
      status: "CONFIRMED",
      purchasedAt: new Date().toISOString(),
      booked_at: new Date().toISOString(),
    };

    db.bookings.push(booking);
    setDb(db);

    return { success: true, data: booking };
  },

  getMyBookings: async (userId: string) => {
    await delay(500);
    const db = getDb();
    const userBookings = db.bookings.filter(
      (b) => b.user_id === userId && b.status === "CONFIRMED",
    );
    return { success: true, data: userBookings };
  },

  cancelTicket: async (bookingId: string) => {
    await delay(800);
    const db = getDb();
    const booking = db.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = "CANCELLED";
    setDb(db);
    return { success: true, message: "Cancelled successfully" };
  },

  // --- ADMIN ACTIONS ---
  createEvent: async (eventData: any) => {
    await delay(800);
    const db = getDb();
    const maxId = db.events.reduce(
      (max, item) => Math.max(max, item.id || 0),
      0,
    );
    const newEvent = {
      id: maxId + 1,
      ...eventData,
      isActive: true,
      isBookmarked: false,
    };

    db.events.push(newEvent);
    setDb(db);

    return { success: true, data: newEvent };
  },

  updateEvent: async (eventId: number, eventData: any) => {
    await delay(800);
    const db = getDb();
    const index = db.events.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error("Event not found");
    db.events[index] = { ...db.events[index], ...eventData };
    setDb(db);
    return { success: true, data: db.events[index] };
  },

  toggleEventActivity: async (eventId: number, isActive: boolean) => {
    await delay(500);
    const db = getDb();
    const index = db.events.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error("Event not found");
    db.events[index].isActive = isActive;
    setDb(db);
    return { success: true, data: db.events[index] };
  },
};
