"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = authClient.useSession();

    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data);
    };

    return (
        // <div className="bg-white w-full flex items-center fixed top-0 left-0 pl-[145px] pr-[145px] py-2.5 h-20 border-b-[1px] border-b-brown-normal">
        //     <div className="w-full">
        //         <div className="w-44 h-9">
        //             <img
        //                 className="w-full object-cover"
        //                 src="/images/logo2.png"
        //                 alt="logo"
        //             />
        //         </div>
        //     </div>

        //     <div className="flex items-center justify-around w-full">
        //         <p className="text-brown-normal">หน้าหลัก</p>
        //         <p>เจิมรถ</p>
        //         <p>ขึ้นบ้านใหม่</p>
        //         <p>ทำบุญวันเกิด</p>
        //         <p>ทำบุญบริษัท</p>
        //         <Link
        //             href={session?.user ? "/user" : "/auth"}
        //             className="w-10 h-10 overflow-hidden rounded-[50%]"
        //         >
        //             <img
        //                 className="w-full object-cover"
        //                 src={
        //                     session?.user.image
        //                         ? session.user.image
        //                         : "/images/AvatarPlaceHolder.png"
        //                 }
        //                 alt={session?.user.name}
        //             />
        //         </Link>
        //     </div>
        // </div>
        <div className="fixed z-50 top-0 left-0 h-[76px] w-full flex justify-center bg-white">
            <div className="w-[1200px] flex justify-between items-center">
                <Link href="/">
                    <img
                        className="h-[35px]"
                        src="/images/logo2.png"
                        alt="logo"
                    />
                </Link>
                <div className="flex items-center gap-10">
                    <ActiveLink href="/">หน้าหลัก</ActiveLink>
                    <ActiveLink href="/car">เจิมรถ</ActiveLink>
                    <ActiveLink href="/home">ขึ้นบ้านใหม่</ActiveLink>
                    <ActiveLink href="/wedding">งานแต่ง</ActiveLink>
                    <ActiveLink href="/company">ทำบุญบริษัท</ActiveLink>
                    <ActiveLink href="/birthday">ทำบุญวันเกิด</ActiveLink>
                    {!!session && (
                        <Link href="/user">
                            <img
                                className="h-[56px] w-[56px] bg-black/10 aspect-[1/1] object-cover rounded-full"
                                src={
                                    session?.user.image
                                        ? session.user.image
                                        : "/images/AvatarPlaceHolder.png"
                                }
                                alt={session?.user.name}
                            />
                        </Link>
                    )}
                    {!session && (
                        <button type="button" onClick={signIn} className="cursor-pointer">
                            <img
                                className="h-[56px] aspect-[1/1] object-cover rounded-full"
                                src="/images/AvatarPlaceHolder.png"
                                alt={session?.user.name}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ActiveLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={`text-lg ${
                isActive ? "text-brown-normal font-bold" : "text-brown-normal"
            }`}
        >
            {children}
        </Link>
    );
}
