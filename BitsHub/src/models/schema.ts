import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  image_url: text("image_url"),
  venue: text("venue").notNull(),
  organiser: text("organiser").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isBookmarked: integer("is_bookmarked", { mode: "boolean" }).notNull().default(false),
});

export const eventDates = sqliteTable("event_dates", {
  id: integer("id").primaryKey().notNull(),
  event_id: integer("event_id").notNull(),
  dateString: text("date_string").notNull(), // e.g., "2024-10-18"
});

export const eventSlots = sqliteTable("event_slots", {
  id: integer("id").primaryKey().notNull(),
  event_id: integer("event_id").notNull(),
  date_id: integer("date_id").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  availableCapacity: integer("available_capacity").notNull().default(100),
});

export const ticketTypes = sqliteTable("ticket_types", {
  id: integer("id").primaryKey().notNull(),
  event_id: integer("event_id").notNull(),
  name: text("name").notNull(), // e.g., "General Admission", "VIP"
  price: real("price").notNull().default(0),
  totalQuantity: integer("total_quantity").notNull().default(100),
});

export const myBookings = sqliteTable("my_bookings", {
  id: text("id").primaryKey().notNull(), // unique booking ID
  user_id: text("user_id").notNull(),
  event_id: integer("event_id").notNull(),
  slot_id: integer("slot_id").notNull(),
  ticket_type_id: integer("ticket_type_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  qrCode: text("qr_code").notNull(),
  status: text("status").notNull().default("CONFIRMED"), // CONFIRMED, CANCELLED
  purchasedAt: text("purchased_at").notNull(),
});
