"use client";

import React from "react";
import { Star, User } from "lucide-react";
import { ReviewWithUser } from "@/actions/temple";

interface ReviewsListProps {
    reviews: ReviewWithUser[];
    loading?: boolean;
}

function formatDate(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return "วันนี้";
    } else if (diffInDays === 1) {
        return "เมื่อวาน";
    } else if (diffInDays < 7) {
        return `${diffInDays} วันที่แล้ว`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} สัปดาห์ที่แล้ว`;
    } else {
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
}

function RatingStars({
    rating,
    size = "sm",
}: {
    rating: number;
    size?: "sm" | "md";
}) {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${starSize} ${
                        star <= rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}

export default function ReviewsList({
    reviews,
    loading = false,
}: ReviewsListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg p-4 border animate-pulse"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                className="w-4 h-4 bg-gray-200 rounded"
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    ยังไม่มีรีวิว
                </h3>
                <p className="text-gray-500">
                    เป็นคนแรกที่เขียนรีวิวสำหรับบริการนี้
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {review.user.image ? (
                                <img
                                    src={review.user.image}
                                    alt={review.user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-gray-400" />
                            )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                            {/* User Info and Rating */}
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-800 truncate">
                                    {review.user.name}
                                </h4>
                                <RatingStars rating={review.rating} />
                            </div>

                            {/* Date */}
                            <p className="text-xs text-gray-500 mb-2">
                                {formatDate(new Date(review.createdAt))}
                            </p>

                            {/* Comment */}
                            {review.comment && (
                                <p className="text-gray-700 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
