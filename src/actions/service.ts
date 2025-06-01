"use server";

import { db } from "@/db";
import { service, temple } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface TempleWithService {
    id: number;
    templeSlug: string;
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
}

export interface TempleData {
    id: string;
    name: string;
    address: string;
    distance: number;
    rating: number;
    reviewCount: number;
    phone?: string;
    openTime: string;
    services: string[];
    image?: string;
    latitude: number;
    longitude: number;
    serviceId: number;
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
}

export async function getServicesByType(
    serviceType: string
): Promise<TempleWithService[]> {
    try {
        const servicesWithTemples = await db
            .select({
                id: service.id,
                templeSlug: service.templeSlug,
                serviceType: service.serviceType,
                forms: service.forms,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
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
                    createdAt: temple.createdAt,
                    updatedAt: temple.updatedAt,
                },
            })
            .from(service)
            .innerJoin(temple, eq(service.templeSlug, temple.slug))
            .where(eq(service.serviceType, serviceType));

        return servicesWithTemples;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export async function transformToTempleData(
    servicesWithTemples: TempleWithService[],
    userLatitude?: number,
    userLongitude?: number
): Promise<TempleData[]> {
    return servicesWithTemples.map((item) => {
        // Calculate distance if user location is provided
        let distance = 0;
        if (userLatitude && userLongitude) {
            distance = calculateDistance(
                userLatitude,
                userLongitude,
                item.temple.latitude,
                item.temple.longitude
            );
        }

        // Format opening hours
        const openTime = `${item.temple.openTime} - ${item.temple.closeTime}`;

        return {
            id: item.temple.slug,
            name: item.temple.name,
            address: item.temple.address,
            distance: distance,
            rating: item.temple.rating,
            reviewCount: item.temple.reviewCount,
            phone: item.temple.phone || undefined,
            openTime: openTime,
            services: [getServiceNameThai(item.serviceType)],
            image:
                item.temple.thumbnails.length > 0
                    ? item.temple.thumbnails[0]
                    : undefined,
            latitude: item.temple.latitude,
            longitude: item.temple.longitude,
            serviceId: item.id,
            forms: item.forms,
        };
    });
}

// Helper function to calculate distance between two coordinates
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Helper function to get Thai service names
function getServiceNameThai(serviceType: string): string {
    const serviceNames: { [key: string]: string } = {
        car: "บริการเจิมรถ",
        home: "ทำบุญขึ้นบ้านใหม่",
        birth: "พิธีขึ้นชื่อ",
        company: "เปิดบริษัท/ร้านค้า",
        wedding: "พิธีแต่งงาน",
    };
    return serviceNames[serviceType] || serviceType;
}
