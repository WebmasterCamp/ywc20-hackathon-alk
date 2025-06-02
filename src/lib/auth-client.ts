import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL:
        process.env.NODE_ENV === "production"
            ? "https://ywc20-hackathon-alk.vercel.app"
            : "http://localhost:3000",
});
