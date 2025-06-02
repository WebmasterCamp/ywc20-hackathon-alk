import React from 'react'
import ServiceCard from "@/components/service-card";
import Link from "next/link";

export interface Service {
    name: string;
    image: string;
    type: "car" | "home" | "wedding" | "company" | "birth" | "death";
} 

const services: Service[] = [
    {
        name: "เจิมรถ",
        image: "/images/car.png",
        type: "car"
    },
    {
        name: "ทำบุญขึ้นบ้านใหม่",
        image: "/images/home.png",
        type: "home"
    },
    {
        name: "งานแต่ง",
        image: "/images/wedding.png",
        type: "wedding"
    },
    {
        name: "ทำบุญบริษัท",
        image: "/images/company.png",
        type: "company"
    },
    {
        name: "งานบุญวันเกิด",
        image: "/images/birth.png",
        type: "birth"
    },
]

export default function Services() {
  return (
    <div className="mt-20 pl-[145px] pr-[145px]">
        <div>
            <h1 className="text-brown-normal text-6xl">นิมนต์</h1>
            <p className="text-[#717171] mt-5">พิธีกรรมมากมาย สะดวก รวดเร็ว ใกล้คุณ</p>
        </div>
        <div className="mt-14 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                {services.map(service => (
                <div className="flex justify-center" key={service.name}>
                    <Link href={`/${service.type}`}>
                        <ServiceCard service={service} />
                    </Link>
                </div>
                ))}
            </div>
        </div>
    </div>
  )
}
