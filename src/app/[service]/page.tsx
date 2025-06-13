"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, MapPin, Filter } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import TempleCard from "@/components/TempleCard";
import { useRouter } from "next/navigation";
import {
    getServicesByType,
    transformToTempleData,
    TempleData,
} from "@/actions/service";

const SERVICES = ["car", "home", "birth", "company", "wedding"];

interface LocationData {
    latitude: number;
    longitude: number;
    address: string;
    shortAddress: string;
}

interface Temple {
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
}

export default function ServicePage() {
    const { service } = useParams();
    const router = useRouter();

    const [selectedLocation, setSelectedLocation] =
        useState<LocationData | null>(null);
    const [temples, setTemples] = useState<TempleData[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

    const getServiceName = (type: string) => {
        const serviceNames: { [key: string]: string } = {
            car: "เขียนยันต์",
            home: "ทำบุญขึ้นบ้านใหม่",
            birth: "พิธีขึ้นชื่อ",
            company: "เปิดบริษัท/ร้านค้า",
            wedding: "พิธีแต่งงาน",
        };
        return serviceNames[type] || type;
    };

    const getServiceIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            car: "🚗",
            home: "🏠",
            birth: "👶",
            company: "🏢",
            wedding: "💒",
        };
        return icons[type] || "🏛️";
    };

    // Load temple data from database (only once on mount)
    const loadTempleData = useCallback(
        async (serviceType: string) => {
            setInitialLoading(true);
            try {
                const servicesWithTemples = await getServicesByType(
                    serviceType
                );
                // Transform without location data first
                const templeData = await transformToTempleData(
                    servicesWithTemples
                );
                setTemples(templeData);
            } catch (error) {
                console.error("Error loading temple data:", error);
                setTemples([]);
            } finally {
                setInitialLoading(false);
            }
        },
        [] // Remove selectedLocation dependency
    );

    // Load initial data when component mounts (only once)
    useEffect(() => {
        if (typeof service === "string" && SERVICES.includes(service)) {
            loadTempleData(service);
        }
    }, [service, loadTempleData]);

    // Calculate distance between two coordinates
    const calculateDistance = useCallback(
        (lat1: number, lon1: number, lat2: number, lon2: number) => {
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
        },
        []
    );

    // Update temple distances when location changes (without re-fetching data)
    useEffect(() => {
        if (selectedLocation && temples.length > 0) {
            setLoading(true);

            // Use setTimeout to simulate smooth loading and prevent blocking
            setTimeout(() => {
                const updatedTemples = temples.map((temple) => ({
                    ...temple,
                    distance: calculateDistance(
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                        temple.latitude,
                        temple.longitude
                    ),
                }));

                setTemples(updatedTemples);
                setLoading(false);
            }, 100); // Short delay for smooth UX
        }
    }, [selectedLocation, calculateDistance]);

    const handleLocationSelected = (location: LocationData) => {
        setSelectedLocation(location);
    };

    const handleTempleSelect = (temple: Temple) => {
        // Navigate to temple detail page
        router.push(`/${service}/${temple.id}`);
    };

    const sortedTemples = [...temples].sort((a, b) => {
        if (sortBy === "distance") {
            return a.distance - b.distance;
        } else {
            return b.rating - a.rating;
        }
    });

    if (typeof service !== "string" || !SERVICES.includes(service as string)) {
        return <div>Service not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-gray-800">
                            {getServiceName(service)}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white rounded-full transition-colors border border-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {getServiceName(service)}
                            </h1>
                            <p className="text-gray-600">
                                ค้นหาวัดที่ให้บริการ{getServiceName(service)}
                                ใกล้คุณ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Sidebar - Location & Filters */}
                    <div className="min-w-[350px] space-y-6">
                        {/* Location Picker */}
                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-yellow-normal" />
                                ตำแหน่งของคุณ
                            </h2>
                            <LocationPicker
                                onLocationSelected={handleLocationSelected}
                                placeholder={`ค้นหาวัดที่ให้บริการ${getServiceName(
                                    service
                                )}`}
                                temples={temples}
                                showTemples={true}
                                onTempleSelected={handleTempleSelect}
                            />

                            {selectedLocation && (
                                <div className="mt-4 p-3 bg-yellow-light rounded-lg">
                                    <p className="text-sm text-yellow-dark break-words">
                                        ✓ กำลังค้นหาวัดใกล้{" "}
                                        {selectedLocation.shortAddress}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                เรียงตาม
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        value="distance"
                                        checked={sortBy === "distance"}
                                        onChange={(e) =>
                                            setSortBy(
                                                e.target.value as
                                                    | "distance"
                                                    | "rating"
                                            )
                                        }
                                        className="text-yellow-normal focus:ring-yellow-normal"
                                    />
                                    <span className="text-gray-700">
                                        ระยะทางใกล้สุด
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        value="rating"
                                        checked={sortBy === "rating"}
                                        onChange={(e) =>
                                            setSortBy(
                                                e.target.value as
                                                    | "distance"
                                                    | "rating"
                                            )
                                        }
                                        className="text-yellow-normal focus:ring-yellow-normal"
                                    />
                                    <span className="text-gray-700">
                                        คะแนนสูงสุด
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Stats Card */}
                        {!initialLoading && temples.length > 0 && (
                            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    สถิติ
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>จำนวนวัด:</span>
                                        <span className="font-medium">
                                            {temples.length} วัด
                                        </span>
                                    </div>
                                    {selectedLocation && (
                                        <div className="flex justify-between">
                                            <span>วัดใกล้ที่สุด:</span>
                                            <span className="font-medium">
                                                {sortedTemples[0]?.distance.toFixed(
                                                    1
                                                )}{" "}
                                                กม.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile Instructions */}
                        <div className="lg:hidden bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-700">
                                💡 เลือกที่อยู่ของคุณเพื่อดูวัดที่ใกล้ที่สุด
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Temple List */}
                    <div className="w-full">
                        {initialLoading ? (
                            /* Initial Loading */
                            <div className="space-y-4">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : temples.length > 0 ? (
                            <>
                                {/* Results Header */}
                                <div className="mb-6">
                                    <p className="text-gray-600 mt-1 ">
                                        วัดที่ให้บริการ{getServiceName(service)}
                                        {selectedLocation &&
                                            ` ใกล้ ${selectedLocation.shortAddress}`}
                                    </p>
                                </div>

                                {/* Temple Grid */}
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
                                        {sortedTemples.map((temple) => (
                                            <TempleCard
                                                key={temple.id}
                                                temple={temple}
                                                serviceType={service}
                                                onSelect={handleTempleSelect}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* No Results */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-yellow-light rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">
                                        {getServiceIcon(service)}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    ไม่พบวัดที่ให้บริการ
                                    {getServiceName(service)}
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    ขณะนี้ยังไม่มีวัดในระบบที่ให้บริการ
                                    {getServiceName(service)}
                                    กรุณาลองเลือกบริการอื่น
                                    หรือติดต่อเราเพื่อเพิ่มวัดใหม่
                                </p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    กลับไปหน้าหลัก
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
