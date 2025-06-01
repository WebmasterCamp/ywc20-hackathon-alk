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
        <div>
            <button onClick={() => signIn()}>Signin Google</button>
        </div>
    );
}
