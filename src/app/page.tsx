"use client";

import { testServerAction } from "@/actions/test";
import { useEffect, useState } from "react";
import { collection } from "@/db/schema";
import { InferModel } from "drizzle-orm";
import Services from "@/components/services";
import Hero from "@/components/hero";

type Collection = InferModel<typeof collection>;

export default function Home() {
    const [, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        const fetchCollections = async () => {
            const collections = await testServerAction();
            setCollections(collections);
        };
        fetchCollections();
    }, []);

    return (
        <div>
            <Hero />
            <Services />
            <div className="flex justify-center pb-20">
                <div className="w-[1200px]">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-brown-normal mb-4">
                            เขียนยันต์
                        </h1>
                        <p className="text-xl font-medium text-brown-normal">
                            พิธีกรรมมากมาย สะดวก รวดเร็ว ใกล้คุณ
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">

                    </div>
                </div>
            </div>
        </div>
    );
}
