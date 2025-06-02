import { drizzle } from "drizzle-orm/mysql2";

export function createDrizzleDb() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    return drizzle(databaseUrl);
}

// Export a getter function for backward compatibility
export function getDb() {
    return createDrizzleDb();
}
