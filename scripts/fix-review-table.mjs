import { getDb } from "../src/db/index.ts";
import mysql from "mysql2/promise";

async function fixReviewTable() {
    // Use direct mysql connection for raw SQL
    const databaseUrl =
        process.env.NODE_ENV === "production"
            ? "mysql://ywc20:ywc20@103.216.158.214:3306/ywc20_proj_dev"
            : process.env.DATABASE_URL ||
              "mysql://ywc20:ywc20@103.216.158.214:3306/ywc20_proj_dev";

    const connection = await mysql.createConnection(databaseUrl);

    try {
        console.log("🔍 Checking review table structure...");

        // Check if review table exists
        const [tables] = await connection.execute(`SHOW TABLES LIKE 'review'`);

        if (tables.length === 0) {
            console.log("❌ Review table does not exist. Creating it...");

            // Create the table from scratch
            await connection.execute(`
                CREATE TABLE review (
                    id int AUTO_INCREMENT PRIMARY KEY,
                    userId varchar(255) NOT NULL,
                    templeSlug varchar(255) NOT NULL,
                    serviceType varchar(255) NOT NULL,
                    rating int NOT NULL,
                    comment text,
                    createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES user(id),
                    FOREIGN KEY (templeSlug) REFERENCES temple(slug),
                    UNIQUE KEY user_temple_service_unique (userId, templeSlug, serviceType)
                )
            `);

            console.log("✅ Review table created successfully!");
        } else {
            console.log("✅ Review table exists. Checking columns...");

            // Check if serviceType column exists
            const [columns] = await connection.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'review' 
                AND COLUMN_NAME = 'serviceType'
            `);

            if (columns.length === 0) {
                console.log("📝 Adding serviceType column...");

                await connection.execute(`
                    ALTER TABLE review 
                    ADD COLUMN serviceType varchar(255) NOT NULL DEFAULT 'car'
                `);

                console.log("✅ serviceType column added!");

                // Update existing records
                console.log("📝 Updating existing records...");
                await connection.execute(
                    `UPDATE review SET serviceType = 'car'`
                );

                // Add unique constraint
                try {
                    await connection.execute(`
                        ALTER TABLE review 
                        ADD CONSTRAINT user_temple_service_unique 
                        UNIQUE(userId, templeSlug, serviceType)
                    `);
                    console.log("✅ Unique constraint added!");
                } catch (err) {
                    console.log(
                        "⚠️  Constraint might already exist:",
                        err.message
                    );
                }
            } else {
                console.log("✅ serviceType column already exists!");
            }
        }

        // Verify final structure
        console.log("🔍 Final table structure:");
        const [structure] = await connection.execute(`DESCRIBE review`);
        console.table(structure);

        console.log("🎉 Review table is ready!");
    } catch (error) {
        console.error("❌ Error fixing review table:", error);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

fixReviewTable();
