"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface ImageCarouselProps {
    images: string[];
    templeName: string;
    className?: string;
}

const ImageCarousel = ({
    images,
    templeName,
    className = "",
}: ImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    if (images.length === 0) {
        return (
            <div
                className={`relative bg-gradient-to-br from-yellow-light to-yellow-normal ${className}`}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-yellow-dark">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-10 h-10" />
                        </div>
                        <p className="text-lg font-medium">
                            รูปภาพ{templeName}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Main Image */}
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={images[currentIndex]}
                    alt={`${templeName} - รูปที่ ${currentIndex + 1}`}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = "none";
                    }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="รูปก่อนหน้า"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="รูปถัดไป"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-2 bg-black/50 p-2 rounded-lg">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentIndex
                                        ? "bg-white"
                                        : "bg-white/50 hover:bg-white/70"
                                }`}
                                aria-label={`ไปยังรูปที่ ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Swipe Support */}
            <div
                className="absolute inset-0 md:hidden"
                onTouchStart={(e) => {
                    const touchStart = e.touches[0].clientX;
                    const handleTouchEnd = (e: TouchEvent) => {
                        const touchEnd = e.changedTouches[0].clientX;
                        const diff = touchStart - touchEnd;

                        if (Math.abs(diff) > 50) {
                            if (diff > 0) {
                                nextImage();
                            } else {
                                prevImage();
                            }
                        }
                        document.removeEventListener(
                            "touchend",
                            handleTouchEnd
                        );
                    };
                    document.addEventListener("touchend", handleTouchEnd);
                }}
            />
        </div>
    );
};

export default ImageCarousel;
