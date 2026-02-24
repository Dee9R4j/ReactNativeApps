import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const EXPO_SQLITE_DB_NAME = "bitshub.db";

// Use synchronous setup for SQLite on React Native (recommended by Expo)
const expoDb = openDatabaseSync(EXPO_SQLITE_DB_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb, { schema });
