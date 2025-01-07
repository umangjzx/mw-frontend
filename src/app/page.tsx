import LoginPage from "@/components/auth/Login";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import DesktopVersionScreen from "@/components/common/DesktopVersionScreen";
import { useEffect } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export default function Page() {
    return (
        <div className="w-screen  bg-background-input mx-auto p-6">
            <LoginPage />
        </div>
    );
}
