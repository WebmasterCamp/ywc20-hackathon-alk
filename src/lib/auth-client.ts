import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL:
        process.env.NODE_ENV === "production"
            ? "https://www.xn--e3cxdc4b3b2br0d.xn--o3cw4h"
            : "http://localhost:3000",
});
