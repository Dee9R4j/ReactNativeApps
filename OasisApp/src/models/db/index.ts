// db/index.ts
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

export const expoDb = SQLite.openDatabaseSync("oasis.db");

// This includes all schemas and relations automatically
export const db = drizzle(expoDb, { schema });
