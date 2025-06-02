import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL:
        process.env.NODE_ENV === "production"
            ? "https://www.prasarnboon.in.th"
            : "http://localhost:3000",
});
