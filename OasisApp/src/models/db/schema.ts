import {
  integer,
  integer as int,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Events Table
export const eventSchema = sqliteTable("events", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  dateTime: text("date_time").notNull(),
  // isLive: int("is_live", { mode: "boolean" }).notNull().default(false),
  description: text("description").default(""),
  categories: text("categories", { mode: "json" })
    .$type<string[] | null>()
    .default(null),
  venueName: text("venue_name").notNull(),
  organiser: text("organiser").notNull(),
  bookmark: int("bookmark", { mode: "boolean" }).notNull().default(false),
});

// Table for event categories
export const categoriesSchema = sqliteTable("categories", {
  name: text("name").primaryKey(),
});

export const cartSchema = sqliteTable(
  "cart_items",
  {
    itemId: text("item_id").notNull(),
    stallId: text("stall_id").notNull(),
    stallName: text("stall_name").notNull(),
    itemName: text("item_name").notNull(),
    price: real("price").notNull(),
    isVeg: integer("is_veg", { mode: "boolean" }).notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.itemId, table.stallId] }),
  })
);

// ==================== Stall Totals Table ====================
export const stallTotalsSchema = sqliteTable("stall_totals", {
  stallId: text("stall_id").primaryKey(), // Single primary key
  stallName: text("stall_name").notNull(),
  totalItems: integer("total_items").notNull().default(0),
  totalAmount: real("total_amount").notNull().default(0),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ==================== Notifications Table ====================
export const notificationsSchema = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("general"), // e.g., 'order_update', 'announcement'
  order_id: integer("order_id"),
  new_status: integer("new_status"),
  old_status: integer("old_status"),
  is_read: integer("is_read", { mode: "boolean" }).notNull().default(false),
  url: text("url"), // Deep link URL for navigation
  created_at: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// ==================== Orders Tables ====================

export const ordersSchema = sqliteTable("orders", {
  id: integer("id").primaryKey(),
  vendor_name: text("vendor_name").notNull(),
  vendor_image: text("vendor_image"),
  vendor_image_background_color: text("vendor_image_background_color"),
  status: integer("status").notNull(),
  price: real("price").notNull(),
  otp: integer("otp"),
  otp_seen: integer("otp_seen", { mode: "boolean" }).notNull().default(false),
  timestamp: text("timestamp").notNull(),
  is_split: integer("is_split", { mode: "boolean" }).notNull().default(false),
});

export const orderItemsSchema = sqliteTable(
  "order_items",
  {
    id: integer("id").notNull(),
    order_id: integer("order_id")
      .notNull()
      .references(() => ordersSchema.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    unit_price: real("unit_price").notNull(),
    is_veg: integer("is_veg", { mode: "boolean" }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.order_id] }),
    };
  }
);

export const ordersRelations = relations(ordersSchema, ({ many }) => ({
  items: many(orderItemsSchema),
}));

export const orderItemsRelations = relations(orderItemsSchema, ({ one }) => ({
  order: one(ordersSchema, {
    fields: [orderItemsSchema.order_id],
    references: [ordersSchema.id],
  }),
}));

// ==================== Stalls Table ====================
export const stallsSchema = sqliteTable("stalls", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image_url: text("image_url"),
  image_background_color: text("image_background_color"),
  location: text("location").notNull(),
  created_at: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// ==================== Menu Items Table ====================
export const menuItemsSchema = sqliteTable("menu_items", {
  id: text("id").primaryKey(),
  stall_id: text("stall_id")
    .notNull()
    .references(() => stallsSchema.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  is_veg: integer("is_veg", { mode: "boolean" }).notNull(),
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  image_url: text("image_url"),
  image_background_color: text("image_background_color"),
  created_at: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const stallsRelations = relations(stallsSchema, ({ many }) => ({
  menuItems: many(menuItemsSchema),
}));

export const menuItemsRelations = relations(menuItemsSchema, ({ one }) => ({
  stall: one(stallsSchema, {
    fields: [menuItemsSchema.stall_id],
    references: [stallsSchema.id],
  }),
}));
//migration set up nahi kiya hai to jab v schema change karo please run -> npm run db:generate  . or setup the migrationa
export const merchSchema = sqliteTable("merch", {
  id: integer("ID").notNull().primaryKey(),
  name: text("name").notNull(),
  merch_id: integer("merch_id").notNull().unique(),
  image_url: text("image_url").notNull(),
  back_image_url: text("back_image_url").notNull(),
  blur_hash: text("blur_hash").notNull(),
  price: real("price").notNull(),
  in_cart_quantity: integer("in_cart_quantity").notNull().default(0),
});
