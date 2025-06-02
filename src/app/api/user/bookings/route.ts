import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createDatabaseConnection } from "@/lib/database";

interface BookingRow {
    id: number;
    date: Date;
    status: string;
    responses: Record<string, unknown>;
    createdAt: Date;
    confirmedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    serviceType: string;
    templeName: string;
    templeSlug: string;
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

        // Get user's bookings from database
        const [rows] = await db.execute(
            `SELECT 
                o.id,
                o.date,
                o.status,
                o.responses,
                o.createdAt,
                o.confirmedAt,
                o.completedAt,
                o.cancelledAt,
                s.serviceType,
                t.name as templeName,
                t.slug as templeSlug
             FROM \`order\` o
             JOIN service s ON o.serviceId = s.id
             JOIN temple t ON s.templeSlug = t.slug
             WHERE o.userId = ?
             ORDER BY o.createdAt DESC`,
            [session.user.id]
        );

        // Transform the data for frontend
        const bookings = (rows as BookingRow[]).map((row) => ({
            id: row.id.toString(),
            templeName: row.templeName,
            templeSlug: row.templeSlug,
            serviceType: row.serviceType,
            serviceName: getServiceName(row.serviceType), // You can customize this
            date: row.date.toISOString().split("T")[0],
            time: new Date(row.date).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            status: row.status,
            responses: row.responses,
            createdAt: row.createdAt,
            confirmedAt: row.confirmedAt,
            completedAt: row.completedAt,
            cancelledAt: row.cancelledAt,
        }));

        // Close the database connection
        await db.end();

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

function getServiceName(serviceType: string): string {
    const serviceNames: { [key: string]: string } = {
        car: "พิธีอธิษฐานรถยนต์",
        home: "พิธีอธิษฐานบ้าน",
        birth: "พิธีขึ้นบ้านใหม่",
        company: "พิธีอธิษฐานบริษัท",
        wedding: "พิธีแต่งงาน",
    };
    return serviceNames[serviceType] || serviceType;
}
