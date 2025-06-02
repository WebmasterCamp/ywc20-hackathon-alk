import { drizzle } from "drizzle-orm/mysql2";

export function createDrizzleDb() {
    // Hardcode DATABASE_URL for production in hackathon environment
    const databaseUrl =
        process.env.NODE_ENV === "production"
            ? "mysql://ywc20:ywc20@103.216.158.214:3306/ywc20_proj_dev"
            : process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    return drizzle(databaseUrl);
}

// Export a getter function for backward compatibility
export function getDb() {
    return createDrizzleDb();
}
