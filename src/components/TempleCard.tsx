import React from "react";
import { MapPin, Clock, Star, Phone, Navigation2 } from "lucide-react";

interface Temple {
    id: string;
    name: string;
    address: string;
    distance: number; // in kilometers
    rating: number;
    reviewCount: number;
    phone?: string;
    openTime: string;
    services: string[];
    image?: string;
    latitude: number;
    longitude: number;
}

interface TempleCardProps {
    temple: Temple;
    serviceType: string;
    onSelect?: (temple: Temple) => void;
}

const TempleCard = ({ temple, serviceType, onSelect }: TempleCardProps) => {
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

    const formatDistance = (distance: number) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} ม.`;
        }
        return `${distance.toFixed(1)} กม.`;
    };

    const openInMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`;
        window.open(url, "_blank");
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-yellow-normal hover:shadow-lg transition-all duration-200 overflow-hidden">
            {/* Temple Image */}
            <div className="relative h-48 bg-gradient-to-br from-yellow-light to-yellow-normal">
                {temple.image ? (
                    <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-yellow-dark">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium">รูปภาพวัด</p>
                        </div>
                    </div>
                )}

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                        <Navigation2 className="w-3 h-3 text-brown-normal" />
                        <span className="text-xs font-medium text-brown-normal">
                            {formatDistance(temple.distance)}
                        </span>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-600 fill-current" />
                        <span className="text-xs font-medium text-gray-800">
                            {temple.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Temple Info */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                        {temple.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {temple.address}
                    </p>

                    {/* Service Badge */}
                    <div className="inline-flex items-center bg-yellow-light px-2 py-1 rounded-md">
                        <span className="text-xs font-medium text-yellow-dark">
                            {getServiceName(serviceType)}
                        </span>
                    </div>
                </div>

                {/* Temple Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>เปิด {temple.openTime}</span>
                    </div>

                    {temple.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{temple.phone}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4" />
                        <span>
                            {temple.rating.toFixed(1)} ({temple.reviewCount}{" "}
                            รีวิว)
                        </span>
                    </div>
                </div>

                {/* Services */}
                {temple.services.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                            บริการอื่นๆ:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {temple.services
                                .slice(0, 3)
                                .map((service, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                                    >
                                        {service}
                                    </span>
                                ))}
                            {temple.services.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                    +{temple.services.length - 3} อื่นๆ
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onSelect?.(temple)}
                        className="flex-1 bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        เลือกวัดนี้
                    </button>
                    <button
                        onClick={openInMaps}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                        title="เปิดใน Google Maps"
                    >
                        <Navigation2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TempleCard;
