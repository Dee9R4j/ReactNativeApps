/**
 * Drizzle ORM schema — SQLite tables for offline-first data
 */
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ==================== STALLS TABLE ====================
export const stalls = sqliteTable("stalls", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  imageBackgroundColor: text("image_background_color"),
  location: text("location"),
  description: text("description"),
  closed: integer("closed", { mode: "boolean" }).default(false),
  updatedAt: text("updated_at").default(""),
});

// ==================== MENU ITEMS TABLE ====================
export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey(),
  stallId: integer("stall_id")
    .notNull()
    .references(() => stalls.id),
  name: text("name").notNull(),
  price: real("price").notNull(),
  isVeg: integer("is_veg", { mode: "boolean" }).default(true),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  description: text("description"),
});

// ==================== ORDERS TABLE ====================
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  vendorName: text("vendor_name"),
  vendorImage: text("vendor_image"),
  vendorImageBgColor: text("vendor_image_bg_color"),
  status: integer("status").default(0),
  price: real("price").notNull(),
  amount: real("amount").notNull(),
  otp: integer("otp"),
  otpSeen: integer("otp_seen", { mode: "boolean" }).default(false),
  itemsJson: text("items_json"), // JSON-serialized OrderItem[]
  timestamp: text("timestamp"),
  createdAt: text("created_at"),
});
