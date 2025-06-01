"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data);
    };

    return (    
        <div className="w-screen h-screen flex justify-center items-center">
            <button className="p-2 rounded-md bg-white text-black" onClick={() => signIn()}>Signin Google</button>
        </div>
    );
}
