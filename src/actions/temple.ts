"use server";

import { getDb } from "@/db";
import { service, temple, order } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface TempleServiceDetail {
    temple: {
        slug: string;
        name: string;
        thumbnails: string[];
        information: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string | null;
        rating: number;
        reviewCount: number;
        openTime: string;
        closeTime: string;
    };
    service: {
        id: number;
        serviceType: string;
        forms: {
            key: string;
            label: string;
            type:
                | "select-one"
                | "select-multiple"
                | "input"
                | "textarea"
                | "checkbox";
            options?: string[];
            helper?: string;
            required?: boolean;
        }[];
    };
}

export interface OrderFormData {
    serviceId: number;
    responses: { key: string; value: string | boolean }[];
    date: Date;
}

export async function getTempleServiceDetail(
    templeSlug: string,
    serviceType: string
): Promise<TempleServiceDetail | null> {
    try {
        const db = getDb();
        const result = await db
            .select({
                temple: {
                    slug: temple.slug,
                    name: temple.name,
                    thumbnails: temple.thumbnails,
                    information: temple.information,
                    address: temple.address,
                    latitude: temple.latitude,
                    longitude: temple.longitude,
                    phone: temple.phone,
                    rating: temple.rating,
                    reviewCount: temple.reviewCount,
                    openTime: temple.openTime,
                    closeTime: temple.closeTime,
                },
                service: {
                    id: service.id,
                    serviceType: service.serviceType,
                    forms: service.forms,
                },
            })
            .from(service)
            .innerJoin(temple, eq(service.templeSlug, temple.slug))
            .where(
                and(
                    eq(temple.slug, templeSlug),
                    eq(service.serviceType, serviceType)
                )
            )
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    } catch (error) {
        console.error("Error fetching temple service detail:", error);
        return null;
    }
}

export async function createOrder(
    userId: string,
    orderData: OrderFormData
): Promise<{ success: boolean; orderId?: number; error?: string }> {
    try {
        const db = getDb();
        const result = await db.insert(order).values({
            userId: userId,
            serviceId: orderData.serviceId,
            responses: orderData.responses,
            date: orderData.date,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Get the inserted order ID
        const orderId = result[0].insertId;

        return {
            success: true,
            orderId: Number(orderId),
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            error: "ไม่สามารถบันทึกคำจองได้ กรุณาลองใหม่อีกครั้ง",
        };
    }
}
