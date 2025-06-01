import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPool } from "mysql2/promise";
import { URL } from "url";

const dbUrl = new URL(process.env.DATABASE_URL as string);

const db = createPool({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
});

export async function GET(request: NextRequest) {
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

        // Get complete user data from database
        const [rows] = await db.execute(
            `SELECT id, name, email, emailVerified, image, phone, address, birthDate, createdAt, updatedAt
             FROM user 
             WHERE id = ?`,
            [session.user.id]
        );

        const users = rows as any[];
        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const user = users[0];

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
