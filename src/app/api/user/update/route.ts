import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPool } from "mysql2/promise";
import { URL } from "url";

const dbUrl = new URL(process.env.DATABASE_URL as string);

const db = createPool({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
});

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, phone, address, birthDate } = body;

        // Handle empty birthDate - convert to null for database
        const processedBirthDate =
            birthDate && birthDate.trim() !== "" ? birthDate : null;

        // Update user data in database
        await db.execute(
            `UPDATE user 
             SET name = ?, phone = ?, address = ?, birthDate = ?, updatedAt = NOW()
             WHERE id = ?`,
            [name, phone, address, processedBirthDate, session.user.id]
        );

        return NextResponse.json(
            { message: "User updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
