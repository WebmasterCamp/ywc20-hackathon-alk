import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { nextCookies } from "better-auth/next-js";
import { URL } from "url";

const dbUrl = new URL(process.env.DATABASE_URL as string);

export const auth = betterAuth({
    database: createPool({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [nextCookies()],
});
