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
        </div>
    );
}
