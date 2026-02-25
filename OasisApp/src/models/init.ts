/**
 * Database initialization — expo-sqlite + Drizzle ORM
 */
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import { logger } from "@/utils/logging";

const DB_NAME = "oasis.db";

// Create database connection
const expoDb = openDatabaseSync(DB_NAME);
export const db = drizzle(expoDb, { schema });

/**
 * Initialize database — create tables if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Create tables using raw SQL (since we're using mock data, keep it simple)
    expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS stalls (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        image_url TEXT,
        image_background_color TEXT,
        location TEXT,
        description TEXT,
        closed INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY,
        stall_id INTEGER NOT NULL REFERENCES stalls(id),
        name TEXT NOT NULL,
        price REAL NOT NULL,
        is_veg INTEGER DEFAULT 1,
        is_available INTEGER DEFAULT 1,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        vendor_id INTEGER NOT NULL,
        vendor_name TEXT,
        vendor_image TEXT,
        vendor_image_bg_color TEXT,
        status INTEGER DEFAULT 0,
        price REAL NOT NULL,
        amount REAL NOT NULL,
        otp INTEGER,
        otp_seen INTEGER DEFAULT 0,
        items_json TEXT,
        timestamp TEXT,
        created_at TEXT
      );
    `);

    logger.success("DB", "Database initialized successfully");
  } catch (error: any) {
    logger.error("DB", "Failed to initialize database", error);
    throw error;
  }
}

/**
 * Reset database — drop and recreate tables (dev only)
 */
export async function resetDatabase(): Promise<void> {
  try {
    expoDb.execSync(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS menu_items;
      DROP TABLE IF EXISTS stalls;
    `);
    await initializeDatabase();
    logger.success("DB", "Database reset complete");
  } catch (error: any) {
    logger.error("DB", "Failed to reset database", error);
    throw error;
  }
}
