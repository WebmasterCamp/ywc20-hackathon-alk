"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRoot = pathname === "/";

  return (
    <>
      {isRoot && <Navbar />}
      {children}
      <div className="mt-20">{isRoot && <Footer />}</div>
    </>
  );
}
