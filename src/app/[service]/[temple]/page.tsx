"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    MapPin,
    Star,
    Clock,
    Phone,
    Navigation2,
    Send,
} from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import DynamicForm, { FormField } from "@/components/DynamicForm";
import {
    getTempleServiceDetail,
    createOrder,
    TempleServiceDetail,
} from "@/actions/temple";
import { authClient } from "@/lib/auth-client";

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

function getServiceIcon(serviceType: string): string {
    const icons: { [key: string]: string } = {
        car: "🚗",
        home: "🏠",
        birth: "👶",
        company: "🏢",
        wedding: "💒",
    };
    return icons[serviceType] || "🏛️";
}

const SERVICES = ["car", "home", "birth", "company", "wedding"];

export default function TempleDetailPage() {
    const { service, temple } = useParams();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [templeData, setTempleData] = useState<TempleServiceDetail | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState<{
        [key: string]: string | boolean | string[];
    }>({});
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (typeof service === "string" && typeof temple === "string") {
            loadTempleData(temple, service);
        }
    }, [service, temple]);

    const loadTempleData = async (templeSlug: string, serviceType: string) => {
        setLoading(true);
        try {
            const data = await getTempleServiceDetail(templeSlug, serviceType);
            setTempleData(data);
        } catch (error) {
            console.error("Error loading temple data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (
        key: string,
        value: string | boolean | string[]
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));

        // Clear error when user starts typing
        if (errors[key]) {
            setErrors((prev) => ({
                ...prev,
                [key]: "",
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validate date and time
        if (!selectedDate) {
            newErrors.date = "กรุณาเลือกวันที่";
        }
        if (!selectedTime) {
            newErrors.time = "กรุณาเลือกเวลา";
        }

        // Validate required fields from service forms
        templeData?.service.forms.forEach((field: FormField) => {
            if (field.required) {
                const value = formValues[field.key];
                if (
                    !value ||
                    (Array.isArray(value) && value.length === 0) ||
                    value === ""
                ) {
                    newErrors[field.key] = `กรุณากรอก${field.label}`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Check if user is authenticated
        if (!session?.user) {
            alert("กรุณาเข้าสู่ระบบก่อนทำการจอง");
            router.push("/auth");
            return;
        }

        if (!validateForm() || !templeData) return;

        setSubmitting(true);
        try {
            // Prepare responses data
            const responses = Object.entries(formValues).map(
                ([key, value]) => ({
                    key,
                    value:
                        typeof value === "boolean"
                            ? value
                            : Array.isArray(value)
                            ? value.join(", ")
                            : value,
                })
            );

            // Create datetime from selected date and time
            const dateTime = new Date(`${selectedDate}T${selectedTime}:00`);

            const result = await createOrder(session.user.id, {
                serviceId: templeData.service.id,
                responses,
                date: dateTime,
            });

            if (result.success) {
                // Success - redirect to success page or show success message
                alert("จองบริการสำเร็จ! เราจะติดต่อกลับไปในเร็วๆ นี้");
                router.push(`/${service}`);
            } else {
                alert(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setSubmitting(false);
        }
    };

    const openInMaps = () => {
        if (templeData) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${templeData.temple.latitude},${templeData.temple.longitude}`;
            window.open(url, "_blank");
        }
    };

    // Validation
    if (
        typeof service !== "string" ||
        typeof temple !== "string" ||
        !SERVICES.includes(service)
    ) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        ไม่พบหน้าที่ต้องการ
                    </h1>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        กลับไปหน้าหลัก
                    </button>
                </div>
            </div>
        );
    }

    // Show loading while checking authentication
    if (isPending || loading) {
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
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>

                {/* Loading Content */}
                <div className="max-w-4xl mx-auto">
                    {/* Image Skeleton */}
                    <div className="h-64 md:h-80 bg-gray-200 animate-pulse"></div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show authentication required message
    if (!session?.user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        จำเป็นต้องเข้าสู่ระบบ
                    </h1>
                    <p className="text-gray-600 mb-6">
                        กรุณาเข้าสู่ระบบเพื่อทำการจองบริการ
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/auth")}
                            className="w-full bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            กลับไปหน้าก่อนหน้า
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!templeData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        ไม่พบข้อมูลวัด
                    </h1>
                    <p className="text-gray-600 mb-6">
                        วัดนี้อาจไม่ให้บริการที่ท่านเลือก
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        กลับไปหน้าก่อนหน้า
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b px-4 py-3 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">
                            {getServiceIcon(service)}
                        </span>
                        <span className="font-semibold text-gray-800 truncate">
                            {templeData.temple.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto bg-white lg:mt-4 lg:mb-4 lg:rounded-xl lg:shadow-sm overflow-hidden">
                {/* Image Carousel */}
                <ImageCarousel
                    images={templeData.temple.thumbnails}
                    templeName={templeData.temple.name}
                    className=""
                />

                {/* Temple Information */}
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center gap-3 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-2xl">
                            {getServiceIcon(service)}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {getServiceNameThai(service)} ที่{" "}
                            {templeData.temple.name}
                        </h1>
                    </div>

                    {/* Temple Details */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                {templeData.temple.name}
                            </h1>
                            <div className="inline-flex items-center bg-yellow-light px-3 py-1 rounded-lg">
                                <span className="text-yellow-dark font-medium text-sm">
                                    {getServiceNameThai(service)}
                                </span>
                            </div>
                        </div>

                        {/* Rating and Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-600 fill-current" />
                                <span>
                                    {templeData.temple.rating.toFixed(1)} (
                                    {templeData.temple.reviewCount} รีวิว)
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                    เปิด {templeData.temple.openTime} -{" "}
                                    {templeData.temple.closeTime}
                                </span>
                            </div>
                            {templeData.temple.phone && (
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    <span>{templeData.temple.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed">
                                    {templeData.temple.address}
                                </p>
                                <button
                                    onClick={openInMaps}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center gap-1"
                                >
                                    <Navigation2 className="w-3 h-3" />
                                    เปิดใน Google Maps
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                รายละเอียด
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {templeData.temple.information}
                            </p>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="border-t pt-6 md:pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
                            📝 ฟอร์มจองบริการ
                        </h2>

                        <DynamicForm
                            fields={templeData.service.forms}
                            values={formValues}
                            onChange={handleFormChange}
                            errors={errors}
                            date={selectedDate}
                            time={selectedTime}
                            onDateChange={setSelectedDate}
                            onTimeChange={setSelectedTime}
                        />

                        {/* Submit Button */}
                        <div className="mt-6 md:mt-8 space-y-4">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full bg-yellow-normal hover:bg-yellow-normal-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        กำลังส่งคำจอง...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        ส่งคำจองบริการ
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                💡 หลังจากส่งคำจอง
                                เจ้าหน้าที่วัดจะติดต่อกลับเพื่อยืนยันรายละเอียด
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
