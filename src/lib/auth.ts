import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { nextCookies } from "better-auth/next-js";
import { URL } from "url";

// Safe database URL parsing with fallback
function createAuthDatabase() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        // Return a minimal configuration for build time
        // This will be properly initialized at runtime
        return createPool({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "temp",
            connectionLimit: 1,
        });
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

export const auth = betterAuth({
    database: createAuthDatabase(),
    socialProviders: {
        google: {
            clientId:
                process.env.NODE_ENV === "production"
                    ? Buffer.from(
                          "NTg2MTMyODk4NjYwLTRkbmlua2N2amc4YWsyMzlpNzI0a3UydWkwdTRlbXA5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t",
                          "base64"
                      ).toString("utf-8")
                    : (process.env.GOOGLE_CLIENT_ID_DEV as string),
            clientSecret:
                process.env.NODE_ENV === "production"
                    ? Buffer.from(
                          "R09DU1BYLVJ4RWdSaUFqRS0tcTZSZEtWZWN6bjVuS095S3U=",
                          "base64"
                      ).toString("utf-8")
                    : (process.env.GOOGLE_CLIENT_SECRET_DEV as string),
        },
    },
    plugins: [nextCookies()],
});
