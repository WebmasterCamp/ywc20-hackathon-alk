import { createPool } from "mysql2/promise";
import { URL } from "url";

export function createDatabaseConnection() {
    // Hardcode DATABASE_URL for production in hackathon environment
    const databaseUrl =
        process.env.NODE_ENV === "production"
            ? "mysql://ywc20:ywc20@103.216.158.214:3306/ywc20_proj_dev"
            : process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const dbUrl = new URL(databaseUrl);

    return createPool({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
    });
}
