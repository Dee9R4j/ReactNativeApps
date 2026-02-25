import {migrate} from "drizzle-orm/expo-sqlite/migrator";
import {db} from "./index";
import migrations from "./drizzle/migrations.js";

export const runMigrations = async () => {
    try {
        await migrate(db, migrations);
        console.log("Migrations run successfully");
    } catch (error: any) {
        console.error("Error running migrations:", error);
        throw error;
    }
};