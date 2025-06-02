"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen pt-[76px]">
                <Navbar />
                {children}
            </div>
            <Footer />
        </>
    );
}
