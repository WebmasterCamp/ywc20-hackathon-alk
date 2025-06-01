"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";

export interface FormField {
    key: string;
    label: string;
    type: "select-one" | "select-multiple" | "input" | "textarea" | "checkbox";
    options?: string[];
    helper?: string;
    required?: boolean;
}

interface DynamicFormProps {
    fields: FormField[];
    values: { [key: string]: string | boolean | string[] };
    onChange: (key: string, value: string | boolean | string[]) => void;
    errors: { [key: string]: string };
    date: string;
    time: string;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

const DynamicForm = ({
    fields,
    values,
    onChange,
    errors,
    date,
    time,
    onDateChange,
    onTimeChange,
}: DynamicFormProps) => {
    const renderField = (field: FormField) => {
        const value = values[field.key] || "";
        const hasError = !!errors[field.key];

        const baseInputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent transition-colors ${
            hasError
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
        }`;

        switch (field.type) {
            case "input":
                return (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className={baseInputClass}
                        placeholder={field.helper || `กรอก${field.label}`}
                    />
                );

            case "textarea":
                return (
                    <textarea
                        value={value as string}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className={`${baseInputClass} min-h-[100px] resize-y`}
                        placeholder={field.helper || `กรอก${field.label}`}
                        rows={4}
                    />
                );

            case "select-one":
                return (
                    <select
                        value={value as string}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className={baseInputClass}
                    >
                        <option value="">เลือก{field.label}</option>
                        {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case "select-multiple":
                return (
                    <div className="space-y-2">
                        {field.options?.map((option, index) => (
                            <label
                                key={index}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={(
                                        (value as string[]) || []
                                    ).includes(option)}
                                    onChange={(e) => {
                                        const currentValues =
                                            (value as string[]) || [];
                                        if (e.target.checked) {
                                            onChange(field.key, [
                                                ...currentValues,
                                                option,
                                            ]);
                                        } else {
                                            onChange(
                                                field.key,
                                                currentValues.filter(
                                                    (v) => v !== option
                                                )
                                            );
                                        }
                                    }}
                                    className="w-4 h-4 text-yellow-normal border-gray-300 rounded focus:ring-yellow-normal"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) =>
                                onChange(field.key, e.target.checked)
                            }
                            className="w-4 h-4 text-yellow-normal border-gray-300 rounded focus:ring-yellow-normal"
                        />
                        <span className="text-gray-700">
                            {field.helper || field.label}
                        </span>
                    </label>
                );

            default:
                return (
                    <div className="text-red-500">
                        Unsupported field type: {field.type}
                    </div>
                );
        }
    };

    // Generate time options (30-minute intervals)
    const timeOptions = [];
    for (let hour = 6; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            timeOptions.push(timeString);
        }
    }

    // Get minimum date (today)
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-6">
            {/* Dynamic Form Fields */}
            {fields.map((field) => (
                <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>

                    {renderField(field)}

                    {field.helper && field.type !== "checkbox" && (
                        <p className="text-gray-500 text-sm mt-1">
                            {field.helper}
                        </p>
                    )}

                    {errors[field.key] && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors[field.key]}
                        </p>
                    )}
                </div>
            ))}

            {/* Date and Time Selection */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📅 เลือกวันที่และเวลาที่ต้องการใช้บริการ
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            วันที่ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => onDateChange(e.target.value)}
                            min={today}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent transition-colors ${
                                errors.date
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                            }`}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    {/* Time Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            เวลา <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={time}
                            onChange={(e) => onTimeChange(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent transition-colors ${
                                errors.time
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                            }`}
                        >
                            <option value="">เลือกเวลา</option>
                            {timeOptions.map((timeOption) => (
                                <option key={timeOption} value={timeOption}>
                                    {timeOption} น.
                                </option>
                            ))}
                        </select>
                        {errors.time && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.time}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicForm;
