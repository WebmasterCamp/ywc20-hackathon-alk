"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrderDetail {
    id: string;
    templeName: string;
    templeSlug: string;
    templeAddress: string;
    templePhone: string;
    serviceType: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
    responses: { key: string; value: string | boolean }[];
    forms: {
        key: string;
        label: string;
        type: string;
        options?: string[];
        helper?: string;
        required?: boolean;
    }[];
    createdAt: string;
    confirmedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
}

export default function OrderDetailPage() {
    const { data: session, isPending } = authClient.useSession();
    const params = useParams();
    const orderId = params.id as string;

    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/user/orders/${orderId}`);
            if (response.ok) {
                const data = await response.json();
                setOrderDetail(data);
            } else if (response.status === 404) {
                setError("ไม่พบข้อมูลการจองนี้");
            } else {
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        } catch (error) {
            console.error("Error fetching order detail:", error);
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (session?.user && orderId) {
            fetchOrderDetail();
        }
    }, [session, orderId, fetchOrderDetail]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "เสร็จสิ้น";
            case "confirmed":
                return "ยืนยันแล้ว";
            case "pending":
                return "รอดำเนินการ";
            case "cancelled":
                return "ยกเลิก";
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle size={20} className="text-green-600" />;
            case "confirmed":
                return <CheckCircle size={20} className="text-blue-600" />;
            case "pending":
                return <AlertCircle size={20} className="text-yellow-600" />;
            case "cancelled":
                return <XCircle size={20} className="text-red-600" />;
            default:
                return <AlertCircle size={20} className="text-gray-600" />;
        }
    };

    const formatResponseValue = (
        response: { key: string; value: string | boolean },
        form: {
            key: string;
            label: string;
            type: string;
            options?: string[];
        }
    ) => {
        if (form.type === "checkbox") {
            return response.value ? "ใช่" : "ไม่ใช่";
        }
        if (
            form.type === "select-multiple" &&
            typeof response.value === "string"
        ) {
            try {
                const selectedValues = JSON.parse(response.value);
                return Array.isArray(selectedValues)
                    ? selectedValues.join(", ")
                    : response.value;
            } catch {
                return response.value;
            }
        }
        return response.value;
    };

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-yellow-light p-4">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-brown-dark">กำลังโหลด...</div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-yellow-light p-4">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-brown-dark">กรุณาเข้าสู่ระบบ</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-yellow-light p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/user"
                                className="flex items-center gap-2 text-brown-normal hover:text-brown-dark transition-colors"
                            >
                                <ArrowLeft size={20} />
                                กลับ
                            </Link>
                        </div>
                        <div className="text-center py-12">
                            <XCircle
                                size={48}
                                className="mx-auto text-red-400 mb-4"
                            />
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div className="min-h-screen bg-yellow-light p-4">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-brown-dark">ไม่พบข้อมูลการจอง</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-light p-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/user"
                        className="flex items-center gap-2 text-brown-normal hover:text-brown-dark transition-colors"
                    >
                        <ArrowLeft size={20} />
                        กลับไปประวัติการจอง
                    </Link>
                </div>

                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-brown-dark mb-2">
                                รายละเอียดการจอง #{orderDetail.id}
                            </h1>
                            <p className="text-brown-normal">
                                จองเมื่อ:{" "}
                                {new Date(
                                    orderDetail.createdAt
                                ).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(
                                orderDetail.status
                            )}`}
                        >
                            {getStatusIcon(orderDetail.status)}
                            <span className="font-medium">
                                {getStatusText(orderDetail.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Service Info */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-brown-dark mb-4">
                        ข้อมูลบริการ
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-brown-normal mb-2">
                                <strong>วัด:</strong> {orderDetail.templeName}
                            </p>
                            <p className="text-brown-normal mb-2">
                                <strong>บริการ:</strong>{" "}
                                {orderDetail.serviceName}
                            </p>
                        </div>
                        <div>
                            <p className="text-brown-normal mb-2 flex items-center gap-2">
                                <Calendar size={16} />
                                <strong>วันที่:</strong>{" "}
                                {new Date(orderDetail.date).toLocaleDateString(
                                    "th-TH"
                                )}
                            </p>
                            <p className="text-brown-normal mb-2 flex items-center gap-2">
                                <Clock size={16} />
                                <strong>เวลา:</strong> {orderDetail.time} น.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Temple Info */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-brown-dark mb-4">
                        ข้อมูลวัด
                    </h2>
                    <div className="space-y-3">
                        <p className="text-brown-normal flex items-start gap-2">
                            <MapPin size={16} className="mt-1 flex-shrink-0" />
                            <span>
                                <strong>ที่อยู่:</strong>{" "}
                                {orderDetail.templeAddress}
                            </span>
                        </p>
                        {orderDetail.templePhone && (
                            <p className="text-brown-normal flex items-center gap-2">
                                <Phone size={16} />
                                <span>
                                    <strong>โทรศัพท์:</strong>{" "}
                                    {orderDetail.templePhone}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Responses */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-brown-dark mb-4">
                        ข้อมูลที่กรอก
                    </h2>
                    <div className="space-y-4">
                        {orderDetail.forms.map((form) => {
                            const response = orderDetail.responses.find(
                                (r) => r.key === form.key
                            );
                            return (
                                <div
                                    key={form.key}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <h3 className="font-medium text-brown-dark mb-2">
                                        {form.label}
                                        {form.required && (
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        )}
                                    </h3>
                                    <div className="text-brown-normal">
                                        {response ? (
                                            <span className="bg-gray-50 px-3 py-2 rounded-md">
                                                {formatResponseValue(
                                                    response,
                                                    form
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                ไม่ได้กรอกข้อมูล
                                            </span>
                                        )}
                                    </div>
                                    {form.helper && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {form.helper}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-brown-dark mb-4">
                        สถานะการดำเนินการ
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-brown-dark">
                                    สร้างคำขอ
                                </p>
                                <p className="text-sm text-brown-normal">
                                    {new Date(
                                        orderDetail.createdAt
                                    ).toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        {orderDetail.confirmedAt && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-brown-dark">
                                        ยืนยันคำขอ
                                    </p>
                                    <p className="text-sm text-brown-normal">
                                        {new Date(
                                            orderDetail.confirmedAt
                                        ).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {orderDetail.completedAt && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-brown-dark">
                                        เสร็จสิ้น
                                    </p>
                                    <p className="text-sm text-brown-normal">
                                        {new Date(
                                            orderDetail.completedAt
                                        ).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {orderDetail.cancelledAt && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-brown-dark">
                                        ยกเลิก
                                    </p>
                                    <p className="text-sm text-brown-normal">
                                        {new Date(
                                            orderDetail.cancelledAt
                                        ).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
