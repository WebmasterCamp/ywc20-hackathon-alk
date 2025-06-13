"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Settings,
    History,
    Calendar,
    Phone,
    Mail,
    Edit3,
    Save,
    X,
    LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { decodeThaiEmail } from "@/lib/utils";

export default function UserProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userProfile, setUserProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        birthDate: "",
        image: "",
    });

    // Fetch complete user profile
    const fetchUserProfile = async () => {
        setProfileLoading(true);
        try {
            const response = await fetch("/api/user/profile");
            if (response.ok) {
                const profile = await response.json();
                setUserProfile(profile);
                console.log("Complete user profile:", profile); // Debug log

                // Update form data with complete profile
                let formattedBirthDate = "";
                if (profile.birthDate) {
                    const birthDateObj = new Date(profile.birthDate);
                    if (!isNaN(birthDateObj.getTime())) {
                        formattedBirthDate = birthDateObj
                            .toISOString()
                            .split("T")[0];
                    }
                }

                setFormData({
                    id: profile.id || "",
                    name: profile.name || "",
                    email: decodeThaiEmail(profile.email) || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    birthDate: formattedBirthDate,
                    image: profile.image || "/images/AvatarPlaceHolder.png",
                });
            } else {
                console.error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setProfileLoading(false);
        }
    };

    // Fetch user bookings
    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const response = await fetch("/api/user/bookings");
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setBookingsLoading(false);
        }
    };

    // Fetch user profile when user is authenticated
    useEffect(() => {
        if (session?.user) {
            fetchUserProfile();
        }
    }, [session]);

    // Fetch bookings when component mounts and user is authenticated
    useEffect(() => {
        if (session?.user && activeTab === "history") {
            fetchBookings();
        }
    }, [session, activeTab]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            // Prepare data for API
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                birthDate: formData.birthDate || null, // Send null instead of empty string
            };

            // Call API to update user data
            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                setIsEditing(false);
                setMessage({
                    type: "success",
                    text: "อัพเดตข้อมูลเรียบร้อยแล้ว",
                });
                // Refetch user profile to get updated data
                await fetchUserProfile();
                // Clear message after 3 seconds
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({
                    type: "error",
                    text: "เกิดข้อผิดพลาดในการอัพเดตข้อมูล",
                });
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to profile data
        if (userProfile) {
            let formattedBirthDate = "";
            if (userProfile.birthDate) {
                const birthDateObj = new Date(userProfile.birthDate);
                if (!isNaN(birthDateObj.getTime())) {
                    formattedBirthDate = birthDateObj
                        .toISOString()
                        .split("T")[0];
                }
            }

            setFormData({
                id: userProfile.id || "",
                name: userProfile.name || "",
                email: decodeThaiEmail(userProfile.email) || "",
                phone: userProfile.phone || "",
                address: userProfile.address || "",
                birthDate: formattedBirthDate,
                image: userProfile.image || "/images/AvatarPlaceHolder.png",
            });
        }
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "upcoming":
                return "bg-blue-100 text-blue-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "เสร็จสิ้น";
            case "upcoming":
                return "กำลังจะมาถึง";
            case "cancelled":
                return "ยกเลิก";
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen bg-yellow-light p-4">
            {isPending || profileLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-brown-dark">กำลังโหลด...</div>
                </div>
            ) : !session?.user ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-brown-dark">กรุณาเข้าสู่ระบบ</div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img
                                        src={
                                            formData.image ||
                                            "/images/AvatarPlaceHolder.png"
                                        }
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-normal"
                                    />
                                    <button className="absolute bottom-0 right-0 bg-yellow-normal text-white p-2 rounded-full hover:bg-yellow-normal-hover transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-brown-dark">
                                        {formData.name}
                                    </h1>
                                    <p className="text-brown-normal flex items-center gap-2 mt-1">
                                        <Mail size={16} />
                                        {formData.email}
                                    </p>
                                    <p className="text-brown-normal flex items-center gap-2 mt-1">
                                        <Phone size={16} />
                                        {formData.phone || "ไม่ได้ระบุ"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <LogOut size={16} />
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                    activeTab === "profile"
                                        ? "text-yellow-dark border-b-2 border-yellow-normal bg-yellow-light"
                                        : "text-brown-normal hover:text-brown-dark"
                                }`}
                            >
                                <Settings size={20} />
                                แก้ไขข้อมูลส่วนตัว
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                    activeTab === "history"
                                        ? "text-yellow-dark border-b-2 border-yellow-normal bg-yellow-light"
                                        : "text-brown-normal hover:text-brown-dark"
                                }`}
                            >
                                <History size={20} />
                                ประวัติการจองบริการ
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "profile" && (
                                <div>
                                    {/* Message display */}
                                    {message && (
                                        <div
                                            className={`mb-4 p-4 rounded-lg ${
                                                message.type === "success"
                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                    : "bg-red-100 text-red-800 border border-red-200"
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-brown-dark">
                                            ข้อมูลส่วนตัว
                                        </h2>
                                        {!isEditing ? (
                                            <button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                                className="flex items-center gap-2 bg-yellow-normal text-brown-dark px-4 py-2 rounded-lg hover:bg-yellow-normal-hover transition-colors"
                                            >
                                                <Edit3 size={16} />
                                                แก้ไข
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                        isSaving
                                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                                            : "bg-green-500 text-white hover:bg-green-600"
                                                    }`}
                                                >
                                                    <Save size={16} />
                                                    {isSaving
                                                        ? "กำลังบันทึก..."
                                                        : "บันทึก"}
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                                >
                                                    <X size={16} />
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-brown-dark font-medium mb-2">
                                                ชื่อ-สกุล
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg text-brown-normal">
                                                    {formData.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-brown-dark font-medium mb-2">
                                                อีเมล
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg text-brown-normal">
                                                    {formData.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-brown-dark font-medium mb-2">
                                                เบอร์โทรศัพท์
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg text-brown-normal">
                                                    {formData.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-brown-dark font-medium mb-2">
                                                วันเกิด
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    name="birthDate"
                                                    value={formData.birthDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg text-brown-normal">
                                                    {formData.birthDate
                                                        ? (() => {
                                                              const date =
                                                                  new Date(
                                                                      formData.birthDate
                                                                  );
                                                              return !isNaN(
                                                                  date.getTime()
                                                              )
                                                                  ? date.toLocaleDateString(
                                                                        "th-TH"
                                                                    )
                                                                  : "ไม่ได้ระบุ";
                                                          })()
                                                        : "ไม่ได้ระบุ"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-brown-dark font-medium mb-2">
                                                ที่อยู่
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent resize-none"
                                                />
                                            ) : (
                                                <p className="p-3 bg-gray-50 rounded-lg text-brown-normal">
                                                    {formData.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "history" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-brown-dark mb-6">
                                        ประวัติการจองบริการ
                                    </h2>

                                    {bookingsLoading ? (
                                        <div className="text-center py-12">
                                            <div className="text-brown-normal">
                                                กำลังโหลดข้อมูล...
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                {bookings.map((booking) => (
                                                    <div
                                                        key={booking.id}
                                                        className="bg-yellow-light border border-yellow-normal rounded-lg p-4"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="font-semibold text-brown-dark">
                                                                        {
                                                                            booking.templeName
                                                                        }
                                                                    </h3>
                                                                    <span
                                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                            booking.status
                                                                        )}`}
                                                                    >
                                                                        {getStatusText(
                                                                            booking.status
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="text-brown-normal mb-2">
                                                                    {
                                                                        booking.serviceName
                                                                    }
                                                                </p>
                                                                <div className="flex flex-wrap gap-4 text-sm text-brown-normal">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {new Date(
                                                                            booking.date
                                                                        ).toLocaleDateString(
                                                                            "th-TH"
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <User
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {
                                                                            booking.time
                                                                        }{" "}
                                                                        น.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <Link
                                                                    href={`/user/orders/${booking.id}`}
                                                                    className="mt-2 text-yellow-dark hover:text-yellow-dark-hover text-sm underline"
                                                                >
                                                                    ดูรายละเอียด
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {bookings.length === 0 && (
                                                <div className="text-center py-12">
                                                    <History
                                                        size={48}
                                                        className="mx-auto text-gray-400 mb-4"
                                                    />
                                                    <p className="text-gray-500">
                                                        ไม่มีประวัติการจองบริการ
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
