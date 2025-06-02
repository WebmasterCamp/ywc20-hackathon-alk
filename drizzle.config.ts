import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "mysql",
    dbCredentials: {
        url:
            process.env.NODE_ENV === "production"
                ? "mysql://ywc20:ywc20@103.216.158.214:3306/ywc20_proj_dev"
                : process.env.DATABASE_URL!,
    },
});
