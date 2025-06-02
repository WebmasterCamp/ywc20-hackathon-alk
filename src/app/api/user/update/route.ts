import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createDatabaseConnection } from "@/lib/database";

export async function POST(request: NextRequest) {
    try {
        // Create database connection inside the handler
        const db = createDatabaseConnection();

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

        // Close the database connection
        await db.end();

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
