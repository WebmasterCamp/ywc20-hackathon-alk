import { createPool } from "mysql2/promise";
import { URL } from "url";

export function createDatabaseConnection() {
    const databaseUrl = process.env.DATABASE_URL;

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
