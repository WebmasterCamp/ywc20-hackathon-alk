import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper";

const sarabun = Sarabun({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "Prasanboon",
    description: "ประสานบุญ แพลตฟอร์มประสานงาน ช่วยเหลือคุณได้ทำบุญอย่างใจอยาก",
    icons: {
        icon: [{ rel: 'icon', url: '/logonotext.png' }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${sarabun.className} antialiased`}>
                <LayoutWrapper>{children}</LayoutWrapper>
            </body>
        </html>
    );
}
