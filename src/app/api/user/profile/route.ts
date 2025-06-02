import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createDatabaseConnection } from "@/lib/database";

interface UserRow {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    phone?: string;
    address?: string;
    birthDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export async function GET(request: NextRequest) {
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

        // Get complete user data from database
        const [rows] = await db.execute(
            `SELECT id, name, email, emailVerified, image, phone, address, birthDate, createdAt, updatedAt
             FROM user 
             WHERE id = ?`,
            [session.user.id]
        );

        const users = rows as UserRow[];
        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const user = users[0];

        // Close the database connection
        await db.end();

        return NextResponse.json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                phone: user.phone,
                address: user.address,
                birthDate: user.birthDate,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
