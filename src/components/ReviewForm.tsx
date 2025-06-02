"use client";

import React, { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { createReview, getUserReview, ReviewData } from "@/actions/temple";

interface ReviewFormProps {
    userId: string;
    templeSlug: string;
    serviceType: string;
    onReviewSubmitted: () => void;
}

export default function ReviewForm({
    userId,
    templeSlug,
    serviceType,
    onReviewSubmitted,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasExistingReview, setHasExistingReview] = useState(false);

    useEffect(() => {
        loadExistingReview();
    }, [userId, templeSlug, serviceType]);

    const loadExistingReview = async () => {
        setLoading(true);
        try {
            const existingReview = await getUserReview(
                userId,
                templeSlug,
                serviceType
            );
            if (existingReview) {
                setRating(existingReview.rating);
                setComment(existingReview.comment || "");
                setHasExistingReview(true);
            }
        } catch (error) {
            console.error("Error loading existing review:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert("กรุณาให้คะแนนก่อนส่งรีวิว");
            return;
        }

        setSubmitting(true);
        try {
            const reviewData: ReviewData = {
                rating,
                comment: comment.trim() || undefined,
            };

            const result = await createReview(
                userId,
                templeSlug,
                serviceType,
                reviewData
            );

            if (result.success) {
                alert(
                    hasExistingReview ? "อัปเดตรีวิวสำเร็จ!" : "ส่งรีวิวสำเร็จ!"
                );
                setHasExistingReview(true);
                onReviewSubmitted();
            } else {
                alert(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="w-8 h-8 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                    <div className="h-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {hasExistingReview ? "แก้ไขรีวิวของคุณ" : "เขียนรีวิวบริการนี้"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ให้คะแนน <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 rounded"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${
                                        star <= (hoveredRating || rating)
                                            ? "text-yellow-500 fill-current"
                                            : "text-gray-300"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            คุณให้คะแนน {rating} ดาว
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        แสดงความคิดเห็น (ไม่บังคับ)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="แบ่งปันประสบการณ์การใช้บริการของคุณ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {comment.length}/500 ตัวอักษร
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="bg-yellow-normal hover:bg-yellow-normal-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {hasExistingReview
                                ? "กำลังอัปเดต..."
                                : "กำลังส่ง..."}
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {hasExistingReview ? "อัปเดตรีวิว" : "ส่งรีวิว"}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
