"use client";

import React from "react";
import { Star } from "lucide-react";

interface ServiceRatingDisplayProps {
    averageRating: number;
    reviewCount: number;
    serviceName: string;
    loading?: boolean;
}

function RatingStars({
    rating,
    size = "md",
}: {
    rating: number;
    size?: "sm" | "md" | "lg";
}) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const starSize = sizeClasses[size];

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${starSize} ${
                        star <= Math.round(rating)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}

export default function ServiceRatingDisplay({
    averageRating,
    reviewCount,
    serviceName,
    loading = false,
}: ServiceRatingDisplayProps) {
    if (loading) {
        return (
            <div className="bg-blue-50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className="w-5 h-5 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        );
    }

    if (reviewCount === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <RatingStars rating={0} />
                    <span className="text-gray-600 font-medium">
                        ยังไม่มีรีวิว
                    </span>
                    <span className="text-sm text-gray-500">
                        สำหรับ{serviceName}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <RatingStars rating={averageRating} />
                <span className="text-blue-900 font-semibold text-lg">
                    {averageRating.toFixed(1)}
                </span>
                <span className="text-blue-700 text-sm">
                    ({reviewCount} รีวิว)
                </span>
                <span className="text-blue-600 text-sm">
                    สำหรับ{serviceName}
                </span>
            </div>
        </div>
    );
}
