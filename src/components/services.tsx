import React from "react";
import ServiceCard from "@/components/service-card";
import Link from "next/link";

export interface Service {
    name: string;
    image: string;
    type: "car" | "home" | "wedding" | "company" | "birth" | "death";
}

const services: Service[] = [
    {
        name: "เขียนยันต์",
        image: "/images/car.png",
        type: "car",
    },
    {
        name: "ทำบุญขึ้นบ้านใหม่",
        image: "/images/home.png",
        type: "home",
    },
    {
        name: "งานแต่ง",
        image: "/images/wedding.png",
        type: "wedding",
    },
    {
        name: "ทำบุญบริษัท",
        image: "/images/company.png",
        type: "company",
    },
    {
        name: "งานบุญวันเกิด",
        image: "/images/birth.png",
        type: "birth",
    },
];

export default function Services() {
    return (
        //   <div className="mt-20 pb-20 pl-[145px] pr-[145px]">
        //       <div>
        //           <h1 className="text-brown-normal text-6xl font-bold">นิมนต์</h1>
        //           <p className="text-brown-normal mt-5 text-xl font-medium">
        //               พิธีกรรมมากมาย สะดวก รวดเร็ว ใกล้คุณ
        //           </p>
        //       </div>
        //       <div className="mt-14 max-w-6xl mx-auto">
        //           <div className="flex items-center justify-between">
        //               {services.map((service) => (
        //                   <div className="flex justify-center" key={service.name}>
        //                       <Link href={`/${service.type}`}>
        //                           <ServiceCard service={service} />
        //                       </Link>
        //                   </div>
        //               ))}
        //           </div>
        //       </div>
        //   </div>
        <div className="flex justify-center py-20">
            <div className="w-[1200px]">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-brown-normal mb-4">
                        นิมนต์
                    </h1>
                    <p className="text-xl font-medium text-brown-normal">
                        พิธีกรรมมากมาย สะดวก รวดเร็ว ใกล้คุณ
                    </p>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {services.map((service) => (
                        <Link
                            href={`/${service.type}`}
                            key={service.name}
                            className="flex flex-col text-brown-normal items-center justify-center bg-[#FEF8E4] py-4 rounded-2xl"
                        >
                            <img
                                className="h-[100px] mb-6"
                                src={service.image}
                                alt={service.name}
                            />
                            <p className="text-xl font-bold">{service.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
