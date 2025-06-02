"use server";

import { getDb } from "@/db";
import { service, temple, order, review, user } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

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

// Review interfaces
export interface ReviewData {
    rating: number;
    comment?: string;
}

export interface ReviewWithUser {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
    };
}

// Create or update a review
export async function createReview(
    userId: string,
    templeSlug: string,
    serviceType: string,
    reviewData: ReviewData
): Promise<{ success: boolean; error?: string }> {
    try {
        const db = getDb();

        // Check if user already has a review for this temple + service
        const existingReview = await db
            .select()
            .from(review)
            .where(
                and(
                    eq(review.userId, userId),
                    eq(review.templeSlug, templeSlug),
                    eq(review.serviceType, serviceType)
                )
            )
            .limit(1);

        if (existingReview.length > 0) {
            // Update existing review
            await db
                .update(review)
                .set({
                    rating: reviewData.rating,
                    comment: reviewData.comment || null,
                    updatedAt: new Date(),
                })
                .where(eq(review.id, existingReview[0].id));
        } else {
            // Create new review
            await db.insert(review).values({
                userId: userId,
                templeSlug: templeSlug,
                serviceType: serviceType,
                rating: reviewData.rating,
                comment: reviewData.comment || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Update temple rating and review count
        await updateTempleRating(templeSlug);

        return { success: true };
    } catch (error) {
        console.error("Error creating review:", error);
        return {
            success: false,
            error: "ไม่สามารถบันทึกรีวิวได้ กรุณาลองใหม่อีกครั้ง",
        };
    }
}

// Get reviews for a temple + serviceType
export async function getReviews(
    templeSlug: string,
    serviceType: string
): Promise<ReviewWithUser[]> {
    try {
        const db = getDb();
        const reviews = await db
            .select({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                user: {
                    name: user.name,
                    image: user.image,
                },
            })
            .from(review)
            .innerJoin(user, eq(review.userId, user.id))
            .where(
                and(
                    eq(review.templeSlug, templeSlug),
                    eq(review.serviceType, serviceType)
                )
            )
            .orderBy(sql`${review.createdAt} DESC`);

        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

// Get user's existing review for temple + serviceType
export async function getUserReview(
    userId: string,
    templeSlug: string,
    serviceType: string
): Promise<ReviewData | null> {
    try {
        const db = getDb();
        const userReview = await db
            .select({
                rating: review.rating,
                comment: review.comment,
            })
            .from(review)
            .where(
                and(
                    eq(review.userId, userId),
                    eq(review.templeSlug, templeSlug),
                    eq(review.serviceType, serviceType)
                )
            )
            .limit(1);

        if (userReview.length === 0) {
            return null;
        }

        return {
            rating: userReview[0].rating,
            comment: userReview[0].comment || undefined,
        };
    } catch (error) {
        console.error("Error fetching user review:", error);
        return null;
    }
}

// Get average rating for temple + serviceType
export async function getServiceRating(
    templeSlug: string,
    serviceType: string
): Promise<{ averageRating: number; reviewCount: number }> {
    try {
        const db = getDb();
        const result = await db
            .select({
                averageRating: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
                reviewCount: sql<number>`COUNT(${review.id})`,
            })
            .from(review)
            .where(
                and(
                    eq(review.templeSlug, templeSlug),
                    eq(review.serviceType, serviceType)
                )
            );

        return {
            averageRating: Number(result[0].averageRating) || 0,
            reviewCount: Number(result[0].reviewCount) || 0,
        };
    } catch (error) {
        console.error("Error fetching service rating:", error);
        return { averageRating: 0, reviewCount: 0 };
    }
}

// Update temple overall rating (this updates the temple table rating based on all services)
async function updateTempleRating(templeSlug: string) {
    try {
        const db = getDb();

        // Calculate overall rating across all services of this temple
        const result = await db
            .select({
                averageRating: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
                reviewCount: sql<number>`COUNT(${review.id})`,
            })
            .from(review)
            .where(eq(review.templeSlug, templeSlug));

        // Update temple table
        await db
            .update(temple)
            .set({
                rating: Number(result[0].averageRating) || 0,
                reviewCount: Number(result[0].reviewCount) || 0,
                updatedAt: new Date(),
            })
            .where(eq(temple.slug, templeSlug));
    } catch (error) {
        console.error("Error updating temple rating:", error);
    }
}
