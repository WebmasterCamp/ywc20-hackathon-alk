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
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";
import ServiceRatingDisplay from "@/components/ServiceRatingDisplay";
import {
    getTempleServiceDetail,
    createOrder,
    TempleServiceDetail,
    getReviews,
    getServiceRating,
    ReviewWithUser,
} from "@/actions/temple";
import { authClient } from "@/lib/auth-client";

function getServiceNameThai(serviceType: string): string {
    const serviceNames: { [key: string]: string } = {
        car: "เขียนยันต์",
        home: "ทำบุญขึ้นบ้านใหม่",
        birth: "พิธีขึ้นชื่อ",
        company: "เปิดบริษัท/ร้านค้า",
        wedding: "พิธีแต่งงาน",
    };
    return serviceNames[serviceType] || serviceType;
}

// Service details and pricing information
function getServiceDetails(serviceType: string) {
    const serviceDetails: {
        [key: string]: {
            emoji: string;
            fullName: string;
            monks: string;
            location: string;
            includes: string;
            price: string;
            note: string;
        };
    } = {
        car: {
            emoji: "🔖",
            fullName: "เจิมรถ / เขียนยันต์มงคล",
            monks: "1 รูป",
            location: "บ้านลูกค้า / จุดนัดหมาย",
            includes: "การเจิมรถ / ลงยันต์ / ให้พร",
            price: "599 บาท",
            note: "ไม่รวมค่าเดินทางหากอยู่นอกพื้นที่บริการ หรือจองนอกเวลามงคล",
        },
        home: {
            emoji: "🏠",
            fullName: "ทำบุญขึ้นบ้านใหม่",
            monks: "5 รูป (สามารถอัปเกรดเป็น 9 รูปได้)",
            location: "บ้านของลูกค้า",
            includes: "ทำพิธีสวดมนต์, ประพรมน้ำ, เจิมประตูบ้าน",
            price: "5,500 บาท",
            note: "ไม่รวมภัตตาหาร หากต้องการเพิ่มสามารถเลือกแพ็กเกจเสริม",
        },
        wedding: {
            emoji: "💍",
            fullName: "พิธีสงฆ์ในงานแต่งงาน",
            monks: "9 รูป",
            location: "สถานที่จัดงานแต่ง",
            includes: "สวดมนต์, เจิมคู่บ่าวสาว, ประพรมน้ำมนต์",
            price: "8,900 บาท",
            note: "มีทีมประสานก่อนวันงาน / สามารถเลือกวัดหรือพระได้ในระบบ",
        },
        company: {
            emoji: "🏢",
            fullName: "ทำบุญบริษัท / เปิดกิจการใหม่",
            monks: "9 รูป",
            location: "สำนักงาน / บริษัทของลูกค้า",
            includes: "สวดมนต์, เจิม, ประพรมน้ำ, เตรียมอาสนะ / พรม",
            price: "10,900 บาท",
            note: "เหมาะกับงานเปิดสำนักงาน, ครบรอบกิจการ, ทำบุญประจำปี",
        },
        birth: {
            emoji: "🎂",
            fullName: "งานทำบุญวันเกิด / ส่วนตัว",
            monks: "1–3 รูป (เลือกได้)",
            location: "บ้าน, ร้านอาหาร, พื้นที่ส่วนตัว",
            includes: "สวดมนต์ / ทำพิธีเสริมดวงวันเกิด",
            price: "3,500 บาท",
            note: "สามารถเลือกฤกษ์วันเกิดที่เหมาะสมผ่านระบบได้ฟรี",
        },
    };

    return serviceDetails[serviceType] || null;
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

    // Review system state
    const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
    const [serviceRating, setServiceRating] = useState({
        averageRating: 0,
        reviewCount: 0,
    });
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data);
    };

    useEffect(() => {
        if (typeof service === "string" && typeof temple === "string") {
            loadTempleData(temple, service);
            loadReviewData(temple, service);
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

    const loadReviewData = async (templeSlug: string, serviceType: string) => {
        setReviewsLoading(true);
        try {
            const [reviewsData, ratingData] = await Promise.all([
                getReviews(templeSlug, serviceType),
                getServiceRating(templeSlug, serviceType),
            ]);
            setReviews(reviewsData);
            setServiceRating(ratingData);
        } catch (error) {
            console.error("Error loading review data:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleReviewSubmitted = () => {
        // Reload review data after a review is submitted
        if (typeof service === "string" && typeof temple === "string") {
            loadReviewData(temple, service);
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
            signIn();
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
                // Success - redirect to order detail page
                alert("จองบริการสำเร็จ! เราจะติดต่อกลับไปในเร็วๆ นี้");
                router.push(`/user/orders/${result.orderId}`);
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
                        <h1 className="text-2xl font-bold text-gray-800">
                            {getServiceNameThai(service as string)} ที่{" "}
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
                                    {getServiceNameThai(service as string)}
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

                    {/* Service Details and Pricing */}
                    {(() => {
                        const serviceDetails = getServiceDetails(
                            service as string
                        );
                        if (!serviceDetails) return null;

                        return (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 md:p-6 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">
                                        {serviceDetails.emoji}
                                    </span>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                                        {serviceDetails.fullName}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="font-semibold text-gray-700 min-w-20">
                                                จำนวนพระ
                                            </span>
                                            <span className="text-gray-600">
                                                {serviceDetails.monks}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="font-semibold text-gray-700 min-w-20">
                                                สถานที่
                                            </span>
                                            <span className="text-gray-600">
                                                {serviceDetails.location}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                            <span className="font-semibold text-gray-700 min-w-20">
                                                สิ่งที่รวม
                                            </span>
                                            <span className="text-gray-600">
                                                {serviceDetails.includes}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-4 border border-yellow-200">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    ราคามาตรฐาน
                                                </p>
                                                <p className="text-2xl font-bold text-yellow-700">
                                                    {serviceDetails.price}
                                                </p>
                                            </div>
                                        </div>

                                        {serviceDetails.note && (
                                            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                                                <p className="text-sm text-yellow-800">
                                                    <strong>หมายเหตุ:</strong>{" "}
                                                    {serviceDetails.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Review System */}
                    <div className="border-t border-b py-6 md:py-8 space-y-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800">
                            รีวิวบริการ
                        </h2>

                        {/* Service Rating Display */}
                        <ServiceRatingDisplay
                            averageRating={serviceRating.averageRating}
                            reviewCount={serviceRating.reviewCount}
                            serviceName={getServiceNameThai(service as string)}
                            loading={reviewsLoading}
                        />

                        {/* Reviews List - Show existing reviews from other users first */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-4">
                                รีวิวจากผู้ใช้งาน ({serviceRating.reviewCount})
                            </h3>
                            <ReviewsList
                                reviews={reviews}
                                loading={reviewsLoading}
                            />
                        </div>

                        {/* Review Form - Show form for writing own review after existing reviews */}
                        <div className="border-t pt-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-4">
                                เขียนรีวิวของคุณ
                            </h3>
                            {session?.user && templeData ? (
                                <ReviewForm
                                    userId={session.user.id}
                                    templeSlug={templeData.temple.slug}
                                    serviceType={service as string}
                                    onReviewSubmitted={handleReviewSubmitted}
                                />
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-gray-600 mb-4">
                                        <p className="font-medium mb-2">
                                            จำเป็นต้องเข้าสู่ระบบ
                                        </p>
                                        <p className="text-sm">
                                            กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวบริการ
                                        </p>
                                    </div>
                                    <button
                                        onClick={signIn}
                                        className="bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                    >
                                        เข้าสู่ระบบ
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="pt-6 md:pt-8">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
                            ฟอร์มจองบริการ
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
                            {session?.user ? (
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
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-gray-600 mb-4">
                                        <p className="font-medium mb-2">
                                            จำเป็นต้องเข้าสู่ระบบ
                                        </p>
                                        <p className="text-sm">
                                            กรุณาเข้าสู่ระบบเพื่อทำการจองบริการ
                                        </p>
                                    </div>
                                    <button
                                        onClick={signIn}
                                        className="bg-yellow-normal hover:bg-yellow-normal-hover text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Send className="w-4 h-4" />
                                        เข้าสู่ระบบเพื่อจอง
                                    </button>
                                </div>
                            )}

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
