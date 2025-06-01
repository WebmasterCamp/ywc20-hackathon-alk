"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// Mock data
const mockUser = {
    id: "1",
    name: "วิชัย ใจดี",
    email: "vichai.jaidee@example.com",
    phone: "081-234-5678",
    address: "123 ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    birthDate: "1985-06-15",
    profileImage: "/api/placeholder/120/120",
};

const mockBookings = [
    {
        id: "1",
        templeName: "วัดพระแก้ว",
        serviceName: "พิธีบูชาเจ้าแม่กวนอิม",
        date: "2024-02-15",
        time: "09:00",
        status: "completed",
        price: 500,
    },
    {
        id: "2",
        templeName: "วัดอรุณราชวราราม",
        serviceName: "พิธีทำบุญตักบาตร",
        date: "2024-03-20",
        time: "06:00",
        status: "upcoming",
        price: 300,
    },
    {
        id: "3",
        templeName: "วัดโพธิ์",
        serviceName: "พิธีสวดอภิธรรม",
        date: "2024-01-10",
        time: "18:00",
        status: "completed",
        price: 800,
    },
];

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(mockUser);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        // Handle save logic here
        setIsEditing(false);
        console.log("Saved user data:", formData);
    };

    const handleCancel = () => {
        setFormData(mockUser);
        setIsEditing(false);
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={formData.profileImage}
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
                                {formData.phone}
                            </p>
                        </div>
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
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-brown-dark">
                                        ข้อมูลส่วนตัว
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-yellow-normal text-brown-dark px-4 py-2 rounded-lg hover:bg-yellow-normal-hover transition-colors"
                                        >
                                            <Edit3 size={16} />
                                            แก้ไข
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <Save size={16} />
                                                บันทึก
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent"
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
                                                {new Date(
                                                    formData.birthDate
                                                ).toLocaleDateString("th-TH")}
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

                                <div className="space-y-4">
                                    {mockBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="bg-yellow-light border border-yellow-normal rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-brown-dark">
                                                            {booking.templeName}
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
                                                        {booking.serviceName}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-brown-normal">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar
                                                                size={14}
                                                            />
                                                            {new Date(
                                                                booking.date
                                                            ).toLocaleDateString(
                                                                "th-TH"
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} />
                                                            {booking.time} น.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-brown-dark">
                                                        ฿{booking.price}
                                                    </p>
                                                    {booking.status ===
                                                        "upcoming" && (
                                                        <button className="mt-2 text-yellow-dark hover:text-yellow-dark-hover text-sm underline">
                                                            ดูรายละเอียด
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {mockBookings.length === 0 && (
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
