import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Hero() {
    return (
        <div className="relative flex justify-center h-[calc(100vh-76px)] bg-[#FEF8E4]">
            <img className="absolute left-0 bottom-0" src="/Grass.svg" alt="grass" />
            <img className="absolute right-2/3 top-1/6" src="/Cloud.svg" alt="grass" />
            <img
                className="absolute top-0 right-0 h-full object-cover"
                src="/monk.svg"
                alt="monk"
            />
            <div className="relative w-[1200px] flex items-center">
                <div>
                    <h1 className="text-brown-normal font-bold text-4xl mb-6">
                        อนุโมทนา
                    </h1>
                    <h1 className="text-brown-normal font-bold text-6xl mb-12">
                        บุญครบถ้วน รับรองอิ่มใจ
                    </h1>
                    <Link
                        href="/car"
                        className="w-fit bg-[#F9D04D] text-brown-normal flex items-center gap-2 px-8 py-3 rounded-full text-lg"
                    >
                        <p>เขียนยันต์ตอนนี้</p>
                        <ArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}
