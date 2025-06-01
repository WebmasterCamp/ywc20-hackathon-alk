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

interface OrderRow {
    id: number;
    date: Date;
    status: string;
    responses: Record<string, unknown>;
    createdAt: Date;
    confirmedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    serviceType: string;
    forms: Record<string, unknown>;
    templeName: string;
    templeSlug: string;
    templeAddress: string;
    templePhone: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id: orderId } = await params;

        // Get order details with service forms and temple info
        const [orderRows] = await db.execute(
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
                s.forms,
                t.name as templeName,
                t.slug as templeSlug,
                t.address as templeAddress,
                t.phone as templePhone
             FROM \`order\` o
             JOIN service s ON o.serviceId = s.id
             JOIN temple t ON s.templeSlug = t.slug
             WHERE o.id = ? AND o.userId = ?`,
            [orderId, session.user.id]
        );

        if (!orderRows || (orderRows as OrderRow[]).length === 0) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        const order = (orderRows as OrderRow[])[0];

        // Transform the data for frontend
        const orderDetail = {
            id: order.id.toString(),
            templeName: order.templeName,
            templeSlug: order.templeSlug,
            templeAddress: order.templeAddress,
            templePhone: order.templePhone,
            serviceType: order.serviceType,
            serviceName: getServiceName(order.serviceType),
            date: order.date.toISOString().split("T")[0],
            time: new Date(order.date).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            status: order.status,
            responses: order.responses,
            forms: order.forms,
            createdAt: order.createdAt,
            confirmedAt: order.confirmedAt,
            completedAt: order.completedAt,
            cancelledAt: order.cancelledAt,
        };

        return NextResponse.json(orderDetail, { status: 200 });
    } catch (error) {
        console.error("Error fetching order details:", error);
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
