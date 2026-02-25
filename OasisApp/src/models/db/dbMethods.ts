import { db } from "./index";
import {
  cartSchema,
  categoriesSchema,
  eventSchema,
  menuItemsSchema,
  notificationsSchema,
  orderItemsSchema,
  ordersSchema,
  stallsSchema,
  stallTotalsSchema,
} from "./schema";
import { IEventProps } from "@/utils/events/types";
import { and, count, desc, eq, sql, inArray } from "drizzle-orm";
import { Order, OrderWithSplitStatus } from "@/utils/food-types";
import { clearVendorCache } from "@/utils/vendorCache";

export async function WipeDB() {
  await db.delete(eventSchema);
  await db.delete(categoriesSchema);
  await db.delete(stallTotalsSchema);
  await db.delete(eventSchema);
  await db.delete(cartSchema);
  await db.delete(notificationsSchema);
  await db.delete(ordersSchema);
  await db.delete(orderItemsSchema);
  await db.delete(menuItemsSchema);
  await db.delete(stallsSchema);
}

// Categories
export const saveCategoriesToSQLite = async (categories: string[]) => {
  if (!categories || categories.length === 0) return;

  await db.delete(categoriesSchema);
  const rows = categories.map((name) => ({ name }));

  await db.insert(categoriesSchema).values(rows);
  console.log("✅ Categories saved:", rows);
};

export const getCategoriesFromSQLite = async (): Promise<
  { name: string }[]
> => {
  return await db.select().from(categoriesSchema);
};

// Events
export const saveEventsWithBookmarkPreserved = async (
  events: IEventProps[]
) => {
  if (!events || events.length === 0) return;

  try {
    const existing = await db.select().from(eventSchema);

    const bookmarkMap = new Map<number, boolean>();
    existing.forEach((e: any) => {
      bookmarkMap.set(e.id, e.bookmark);
    });
    await db.delete(eventSchema);

    const rows = events.map((e) => {
      const preservedBookmark = bookmarkMap.has(e.id)
        ? bookmarkMap.get(e.id)! // if exists, preserve
        : e.bookmark ?? false; // else fallback to backend or default false

      return {
        id: e.id,
        name: e.name,
        dateTime: e.date_time,
        isLive: e.is_live,
        description: e.description ?? "",
        categories: e.categories ?? [],
        venueName: e.venue_name,
        organiser: e.organiser,
        bookmark: preservedBookmark,
      };
    });

    await db.insert(eventSchema).values(rows);
    console.log("✅ Events saved with bookmark preservation:", rows.length);
  } catch (error: any) {
    console.error("❌ Error saving events with preserved bookmarks:", error);
  }
};

export const saveEventsToSQLite = async (events: IEventProps[]) => {
  if (!events || events.length === 0) return;

  try {
    await db.delete(eventSchema); // clear old events

    const rows = events.map((e) => ({
      id: e.id,
      name: e.name,
      dateTime: e.date_time,
      isLive: e.is_live,
      description: e.description ?? "",
      categories: e.categories ?? [],
      venueName: e.venue_name,
      organiser: e.organiser,
      bookmark: e.bookmark ?? false,
    }));

    await db.insert(eventSchema).values(rows);
    console.log("✅ Events saved to SQLite:", rows.length);
  } catch (error: any) {
    console.error("❌ Error saving events to SQLite:", error);
  }
};

export const getEventsFromSQLite = async (): Promise<IEventProps[]> => {
  try {
    const rows = await db.select().from(eventSchema);

    return rows.map((e: any) => ({
      id: e.id,
      name: e.name,
      date_time: e.dateTime,
      is_live: e.isLive,
      description: e.description ?? "",
      categories: e.categories ?? [],
      venue_name: e.venueName,
      organiser: e.organiser,
      bookmark: e.bookmark ?? false,
    }));
  } catch (error: any) {
    console.error("❌ Error fetching events from SQLite:", error);
    return [];
  }
};

export const getBookmarkedEventsFromSQLite = async (): Promise<
  IEventProps[]
> => {
  try {
    const rows = await db
      .select()
      .from(eventSchema)
      .where(eq(eventSchema.bookmark, true));

    return rows.map((e: any) => ({
      id: e.id,
      name: e.name,
      date_time: e.dateTime,
      is_live: e.isLive,
      description: e.description ?? "",
      categories: e.categories ?? [],
      venue_name: e.venueName,
      organiser: e.organiser,
      bookmark: true,
    }));
  } catch (error: any) {
    console.error("❌ Error fetching bookmarked events:", error);
    return [];
  }
};

export const updateEventInSQLite = async (event: IEventProps) => {
  try {
    await db
      .update(eventSchema)
      .set({
        name: event.name,
        dateTime: event.date_time,
        // isLive: event.is_live,
        description: event.description,
        categories: event.categories ?? [],
        venueName: event.venue_name,
        organiser: event.organiser,
        bookmark: event.bookmark,
      })
      .where(eq(eventSchema.id, event.id));

    console.log("✅ Event updated in SQLite:", event.id);
  } catch (error: any) {
    console.error("❌ Error updating event in SQLite:", error);
  }
};

export const deleteEventsFromSQLite = async () => {
  try {
    await db.delete(eventSchema);
    console.log("✅ All events cleared from SQLite");
  } catch (error: any) {
    console.error("❌ Error clearing events from SQLite:", error);
  }
};

// -------------------- Cart --------------------
export const saveCartItem = async (
  itemId: string,
  stallId: string,
  stallName: string,
  itemName: string,
  price: number,
  isVeg: boolean,
  quantity: number
): Promise<void> => {
  try {
    await db
      .insert(cartSchema)
      .values({ itemId, stallId, stallName, itemName, price, isVeg, quantity })
      .onConflictDoUpdate({
        target: [cartSchema.itemId, cartSchema.stallId],
        set: { quantity, updatedAt: new Date().toISOString() },
      });
  } catch (error: any) {
    console.error("Error saving cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId: string, stallId: string) => {
  try {
    await db
      .delete(cartSchema)
      .where(
        and(eq(cartSchema.itemId, itemId), eq(cartSchema.stallId, stallId))
      );
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const getCartItems = async (): Promise<any[]> => {
  try {
    const items = await db.select().from(cartSchema);
    return items;
  } catch (error: any) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const clearEntireCart = async (): Promise<void> => {
  try {
    await db.delete(cartSchema);
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export const clearCartForStall = async (stallId: string): Promise<void> => {
  try {
    await db.delete(cartSchema).where(eq(cartSchema.stallId, stallId));
  } catch (error: any) {
    console.error(`Error clearing cart for stall ${stallId}:`, error);
    throw error;
  }
};

export const updateStallTotal = async (
  stallId: string,
  stallName: string,
  totalItems: number,
  totalAmount: number
): Promise<void> => {
  try {
    await db
      .insert(stallTotalsSchema)
      .values({
        stallId,
        stallName,
        totalItems,
        totalAmount,
      })
      .onConflictDoUpdate({
        target: stallTotalsSchema.stallId,
        set: {
          totalItems,
          totalAmount,
          updatedAt: new Date().toISOString(),
        },
      });
  } catch (error: any) {
    console.error(" Error updating stall total:", error);
    throw error;
  }
};

export const getStallTotals = async (): Promise<any[]> => {
  try {
    return await db.query.stallTotalsSchema.findMany();
  } catch (error: any) {
    console.error(" Error getting stall totals:", error);
    throw error;
  }
};

export const clearStallTotal = async (stallId: string): Promise<void> => {
  try {
    await db
      .delete(stallTotalsSchema)
      .where(eq(stallTotalsSchema.stallId, stallId));
  } catch (error: any) {
    console.error(`Error clearing stall total for stall ${stallId}:`, error);
    throw error;
  }
};

export const clearAllStallTotals = async (): Promise<void> => {
  try {
    await db.delete(stallTotalsSchema);
  } catch (error: any) {
    console.error("Error clearing all stall totals:", error);
    throw error;
  }
};

// ==================== Notifications ====================

export const saveNotificationToDB = async (notification: {
  title: string;
  message: string;
  type: string;
  order_id?: number;
  new_status?: number;
  old_status?: number;
}) => {
  try {
    // console.log("Saving notification to DB:", notification);

    const result = await db.insert(notificationsSchema).values({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      order_id: notification.order_id || null,
      new_status: notification.new_status || null,
      old_status: notification.old_status || null,
      is_read: false,
    });

    return result;
  } catch (error: any) {
    console.error("Error saving notification to DB:", error);
    throw error;
  }
};

export const saveNotificationWithIdToDB = async (notification: {
  id: number;
  title: string;
  message: string;
  type: string;
  order_id?: number;
  new_status?: number;
  old_status?: number;
  is_read: boolean;
  created_at: string;
  url?: string;
}) => {
  try {
    const result = await db
      .insert(notificationsSchema)
      .values({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        order_id: notification.order_id || null,
        new_status: notification.new_status || null,
        old_status: notification.old_status || null,
        is_read: notification.is_read,
        url: notification.url || null,
        created_at: notification.created_at,
      })
      .onConflictDoUpdate({
        target: notificationsSchema.id,
        set: {
          title: notification.title,
          message: notification.message,
          type: notification.type,
          order_id: notification.order_id || null,
          new_status: notification.new_status || null,
          old_status: notification.old_status || null,
          is_read: notification.is_read,
          url: notification.url || null,
        },
      });

    return result;
  } catch (error: any) {
    console.error("Error saving notification with ID to DB:", error);
    throw error;
  }
};

export const getNotificationsFromDB = async () => {
  try {
    const notifications = await db
      .select()
      .from(notificationsSchema)
      .orderBy(desc(notificationsSchema.created_at));

    return notifications;
  } catch (error: any) {
    console.error("Error retrieving notifications from DB:", error);
    throw error;
  }
};

export const getUnreadNotificationCountDB = async (): Promise<number> => {
  try {
    const result = await db
      .select({ value: count() })
      .from(notificationsSchema)
      .where(eq(notificationsSchema.is_read, false));

    const unreadCount = result[0]?.value ?? 0;
    return unreadCount;
  } catch (error: any) {
    console.error("Error getting unread notification count:", error);
    return 0;
  }
};

export const markNotificationAsReadDB = async (notificationId: number) => {
  try {
    await db
      .update(notificationsSchema)
      .set({ is_read: true })
      .where(eq(notificationsSchema.id, notificationId));
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsReadDB = async () => {
  try {
    await db
      .update(notificationsSchema)
      .set({ is_read: true })
      .where(eq(notificationsSchema.is_read, false));
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// ==================== Orders ====================

export const getOrdersFromDB = async (): Promise<Order[]> => {
  const result = await db.query.ordersSchema.findMany({
    with: {
      items: true,
    },
    orderBy: (orders, { desc }) => [desc(orders.timestamp)],
  });

  // Enrich orders with stall background colors if missing
  const stalls = await getStallsFromDB();
  const stallDataMap = new Map<
    string,
    { image: string; bgColor: string | undefined }
  >();

  stalls.forEach((stall) => {
    const vendorKey = stall.name?.trim().toLowerCase();
    if (!vendorKey) {
      return;
    }

    const image = stall.image_url || "";
    const bgColor =
      typeof stall.image_background_color === "string" &&
      stall.image_background_color.trim().length > 0
        ? stall.image_background_color
        : undefined;

    if (!image && !bgColor) {
      return;
    }

    stallDataMap.set(vendorKey, {
      image,
      bgColor,
    });
  });

  // Map orders and enrich with stall data if needed
  const enrichedOrders = result.map((order) => {
    const stallData = stallDataMap.get(
      order.vendor_name?.trim().toLowerCase() ?? ""
    );
    return {
      ...order,
      vendor_image:
        order.vendor_image ||
        (stallData?.image?.length ? stallData.image : null) ||
        null,
      vendor_image_background_color:
        order.vendor_image_background_color || stallData?.bgColor || null,
    };
  });

  return enrichedOrders as unknown as Order[];
};

export const saveOrdersToDB = async (orders: Order[]) => {
  if (!orders || orders.length === 0) return;

  for (const order of orders) {
    // Upsert the main order
    await db
      .insert(ordersSchema)
      .values({
        id: order.id,
        vendor_name: order.vendor_name,
        vendor_image: order.vendor_image || null,
        vendor_image_background_color:
          order.vendor_image_background_color || null,
        status: order.status,
        price: order.price,
        otp: order.otp,
        otp_seen: order.otp_seen,
        timestamp: order.timestamp,
        is_split: order.is_split,
      })
      .onConflictDoUpdate({
        target: ordersSchema.id,
        set: {
          status: order.status,
          otp_seen: order.otp_seen,
          vendor_image: order.vendor_image || null,
          vendor_image_background_color:
            order.vendor_image_background_color || null,
          is_split: order.is_split,
        },
      });

    // Upsert the associated items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await db
          .insert(orderItemsSchema)
          .values({
            id: item.id,
            order_id: order.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            is_veg: item.is_veg,
          })
          .onConflictDoUpdate({
            target: [orderItemsSchema.id, orderItemsSchema.order_id],
            set: {
              name: sql`excluded
                            .
                            name`,
              quantity: sql`excluded
                            .
                            quantity`,
              unit_price: sql`excluded
                            .
                            unit_price`,
              is_veg: sql`excluded
                            .
                            is_veg`,
            },
          });
      }
    }
  }
};

export const updateOrderStatusInDB = async (
  orderId: number,
  newStatus: number
) => {
  await db
    .update(ordersSchema)
    .set({ status: newStatus })
    .where(eq(ordersSchema.id, orderId));
};

export const updateOtpSeenInDB = async (orderId: number, otp: number) => {
  await db
    .update(ordersSchema)
    .set({ otp_seen: true, otp: otp })
    .where(eq(ordersSchema.id, orderId));
};

export const getFinishedOrdersFromDB = async (): Promise<Order[]> => {
  const result = await db.query.ordersSchema.findMany({
    with: {
      items: true,
    },
    where: (orders, { eq }) => eq(orders.status, 3),
    orderBy: (orders, { desc }) => [desc(orders.timestamp)],
  });
  return result as unknown as Order[];
};

export const getNonSplitFinishedOrdersFromDB = async (): Promise<
  OrderWithSplitStatus[]
> => {
  console.log(
    "DB_METHOD: Querying for non-split finished orders (status=3, is_split=false OR null)..."
  ); // <-- Updated log

  try {
    const result = await db.query.ordersSchema.findMany({
      with: {
        items: true,
      },
      where: (orders, { eq, and, or, isNull }) =>
        and(
          eq(orders.status, 3),
          or(eq(orders.is_split, false), isNull(orders.is_split))
        ),
      orderBy: (orders, { desc }) => [desc(orders.timestamp)],
    });

    console.log(
      "DB_METHOD: Raw Drizzle Result:",
      JSON.stringify(result, null, 2)
    );
    console.log(`DB_METHOD: Found ${result.length} matching orders in SQLite.`);

    return result as unknown as OrderWithSplitStatus[];
  } catch (error: any) {
    console.error("DB_METHOD: Error during Drizzle query:", error);
    return [];
  }
};

export const getAllOrdersForDebug = async (): Promise<Order[]> => {
  try {
    const result = await db.query.ordersSchema.findMany({
      orderBy: (orders, { desc }) => [desc(orders.timestamp)],
    });
    return result as unknown as Order[];
  } catch (error: any) {
    console.error("DEBUG_DB: Error dumping all orders:", error);
    return [];
  }
};

export const markOrdersAsSplitInDB = async (
  orderIds: string[]
): Promise<void> => {
  if (orderIds.length === 0) {
    console.log(
      "DB_METHOD: markOrdersAsSplitInDB received 0 IDs, skipping update."
    );
    return;
  }

  const numericIds = orderIds.map((id) => parseInt(id, 10));

  console.log(
    `DB_METHOD: Marking ${numericIds.length} orders as is_split=true...`
  );

  try {
    await db
      .update(ordersSchema)
      .set({ is_split: true })
      .where(inArray(ordersSchema.id, numericIds));

    console.log("DB_METHOD: Successfully updated local orders as split.");
  } catch (error: any) {
    console.error("DB_METHOD: Error updating local orders as split:", error);
    throw error;
  }
};

// ==================== Stalls ====================

export const saveStallsToDB = async (stalls: any[]) => {
  if (!stalls || stalls.length === 0) return;

  try {
    // Clear existing stalls
    await db.delete(stallsSchema);

    const rows = stalls.map((stall) => ({
      id: stall.id.toString(),
      name: stall.name,
      image_url: stall.image_url || null,
      image_background_color:
        stall.image_background_color ||
        (typeof stall.tags === "string" && stall.tags.trim().length > 0
          ? stall.tags
          : null),
      location: stall.location,
    }));

    await db.insert(stallsSchema).values(rows);
    // console.log(" Stalls saved to database:", rows.length);
  } catch (error: any) {
    console.error(" Error saving stalls to database:", error);
    throw error;
  }
};

export const getStallsFromDB = async (): Promise<any[]> => {
  try {
    const rows = await db.select().from(stallsSchema);
    return rows.map((row) => ({
      id: parseInt(row.id),
      name: row.name,
      image_url: row.image_url,
      image_background_color: row.image_background_color,
      location: row.location,
    }));
  } catch (error: any) {
    console.error(" Error fetching stalls from database:", error);
    return [];
  }
};

// ==================== Menu Items ====================

export const saveMenuToDB = async (stallId: string, menuItems: any[]) => {
  if (!menuItems || menuItems.length === 0) return;

  try {
    // Clear existing menu items for this stall
    await db
      .delete(menuItemsSchema)
      .where(eq(menuItemsSchema.stall_id, stallId));

    const rows = menuItems.map((item) => ({
      id: item.id.toString(),
      stall_id: stallId,
      name: item.name,
      price: item.price,
      is_veg: item.is_veg,
      is_available: item.is_available ?? true,
      image_url: item.image_url || null,
      image_background_color: item.image_background_color || null,
    }));

    await db.insert(menuItemsSchema).values(rows);
    // console.log(` Menu items saved for stall ${stallId}:`, rows.length);
  } catch (error: any) {
    console.error(` Error saving menu for stall ${stallId}:`, error);
    throw error;
  }
};

export const getMenuFromDB = async (stallId: string): Promise<any[]> => {
  try {
    const rows = await db
      .select()
      .from(menuItemsSchema)
      .where(eq(menuItemsSchema.stall_id, stallId));

    return rows.map((row) => ({
      id: parseInt(row.id),
      name: row.name,
      price: row.price,
      is_veg: row.is_veg,
      is_available: row.is_available,
      image_url: row.image_url,
      image_background_color: row.image_background_color,
    }));
  } catch (error: any) {
    console.error(` Error fetching menu for stall ${stallId}:`, error);
    return [];
  }
};

export const getAllMenuItemsFromDB = async (): Promise<any[]> => {
  try {
    const rows = await db.select().from(menuItemsSchema);
    return rows.map((row) => ({
      id: parseInt(row.id),
      stall_id: row.stall_id,
      name: row.name,
      price: row.price,
      is_veg: row.is_veg,
      is_available: row.is_available,
      image_url: row.image_url,
      image_background_color: row.image_background_color,
    }));
  } catch (error: any) {
    console.error(" Error fetching all menu items from database:", error);
    return [];
  }
};

export const clearAllFoodData = async () => {
  await db.delete(menuItemsSchema);
  await db.delete(stallsSchema);
  // Clear MMKV vendor cache (images and background colors)
  clearVendorCache();
};

export const clearAllOrdersData = async () => {
  await db.delete(orderItemsSchema);
  await db.delete(ordersSchema);
};
