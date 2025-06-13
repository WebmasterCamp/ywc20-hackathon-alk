"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const shouldHideNavbar = pathname.startsWith("/auth");

    return (
        <>
            <div className={`min-h-screen ${!shouldHideNavbar && "pt-[76px]"}`}>
                {!shouldHideNavbar && <Navbar />}
                {children}
            </div>
            <Footer />
        </>
    );
}
