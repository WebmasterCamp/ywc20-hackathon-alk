"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Filter, Search } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import TempleCard from "@/components/TempleCard";
import { useRouter } from "next/navigation";

const SERVICES = ["car", "home", "birth", "company", "wedding"];

// Mock temple data - ในอนาคตจะเอามาจาก API
const mockTemples = [
    {
        id: "1",
        name: "วัดพระแก้ว",
        address: "2 ถนนหน้าพระลาน พระบรมมหาราชวัง กรุงเทพมหานคร 10200",
        distance: 0.8,
        rating: 4.8,
        reviewCount: 1234,
        phone: "02-623-5500",
        openTime: "08:30 - 15:30",
        services: ["พิธีแต่งงาน", "พิธีขึ้นชื่อ", "ทำบุญขึ้นบ้านใหม่"],
        latitude: 13.7515,
        longitude: 100.4925,
    },
    {
        id: "2",
        name: "วัดโพธิ์",
        address: "2 ถนนเศรษฐี เขตพระนคร กรุงเทพมหานคร 10200",
        distance: 1.2,
        rating: 4.6,
        reviewCount: 876,
        phone: "02-226-0335",
        openTime: "08:00 - 17:00",
        services: ["บริการเจิมรถ", "เปิดบริษัท/ร้านค้า", "พิธีแต่งงาน"],
        latitude: 13.7465,
        longitude: 100.4925,
    },
    {
        id: "3",
        name: "วัดอรุณราชวรารามราชวรมหาวิหาร",
        address: "158 ถนนวังโดม เขตบางกอกใหญ่ กรุงเทพมหานคร 10600",
        distance: 2.1,
        rating: 4.7,
        reviewCount: 2145,
        phone: "02-891-2185",
        openTime: "06:00 - 18:00",
        services: ["พิธีขึ้นชื่อ", "ทำบุญขึ้นบ้านใหม่", "บริการเจิมรถ"],
        latitude: 13.7436,
        longitude: 100.4881,
    },
    {
        id: "4",
        name: "วัดราชนัดดาราม",
        address: "434 ถนนฟิวเจอร์พาร์ค รังสิต เขตธัญบุรี ปทุมธานี 12110",
        distance: 3.5,
        rating: 4.5,
        reviewCount: 543,
        phone: "02-516-8444",
        openTime: "06:00 - 18:00",
        services: ["เปิดบริษัท/ร้านค้า", "บริการเจิมรถ"],
        latitude: 13.9957,
        longitude: 100.6196,
    },
];

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
    const [temples, setTemples] = useState(mockTemples);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

    const getServiceName = (type: string) => {
        const serviceNames: { [key: string]: string } = {
            car: "บริการเจิมรถ",
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

    // Calculate distance between two coordinates
    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
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
    };

    // Update temple distances when location changes
    useEffect(() => {
        if (selectedLocation) {
            setLoading(true);

            // Calculate distances and update temples
            const updatedTemples = mockTemples.map((temple) => ({
                ...temple,
                distance: calculateDistance(
                    selectedLocation.latitude,
                    selectedLocation.longitude,
                    temple.latitude,
                    temple.longitude
                ),
            }));

            // Sort temples
            const sortedTemples = [...updatedTemples].sort((a, b) => {
                if (sortBy === "distance") {
                    return a.distance - b.distance;
                } else {
                    return b.rating - a.rating;
                }
            });

            setTemples(sortedTemples);

            // Simulate API delay
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [selectedLocation, sortBy]);

    const handleLocationSelected = (location: LocationData) => {
        setSelectedLocation(location);
    };

    const handleTempleSelect = (temple: Temple) => {
        // Navigate to temple detail or booking page
        console.log("Selected temple:", temple);
        // router.push(`/booking/${temple.id}?service=${service}`);
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
                        <span className="text-2xl">
                            {getServiceIcon(service)}
                        </span>
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
                        <span className="text-3xl">
                            {getServiceIcon(service)}
                        </span>
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

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Sidebar - Location & Filters */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Location Picker */}
                        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-yellow-normal" />
                                ตำแหน่งของคุณ
                            </h2>
                            <LocationPicker
                                onLocationSelected={handleLocationSelected}
                                placeholder={`เลือกที่อยู่เพื่อค้นหา${getServiceName(
                                    service
                                )}`}
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

                        {/* Mobile Instructions */}
                        <div className="lg:hidden bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-700">
                                💡 เลือกที่อยู่ของคุณเพื่อดูวัดที่ใกล้ที่สุด
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Temple List */}
                    <div className="lg:col-span-3">
                        {selectedLocation ? (
                            <>
                                {/* Results Header */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            วัดใกล้คุณ
                                        </h2>
                                        <div className="text-sm text-gray-600">
                                            {temples.length} วัด
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-1">
                                        วัดที่ให้บริการ{getServiceName(service)}
                                        ใกล้ {selectedLocation.shortAddress}
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
                                    <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
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

                                {/* No Results */}
                                {!loading && sortedTemples.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                            ไม่พบวัดในบริเวณนี้
                                        </h3>
                                        <p className="text-gray-600">
                                            ลองเปลี่ยนตำแหน่งหรือขยายพื้นที่การค้นหา
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-yellow-light rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">
                                        {getServiceIcon(service)}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    ค้นหา{getServiceName(service)}
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    เลือกที่อยู่ของคุณเพื่อค้นหาวัดที่ให้บริการ
                                    {getServiceName(service)}ใกล้คุณ
                                </p>
                                <div className="inline-flex items-center gap-2 text-yellow-normal">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium">
                                        เลือกที่อยู่ด้านซ้าย
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
