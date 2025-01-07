"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DesktopVersionScreen from "@/components/common/DesktopVersionScreen";

export default function DesktopVersionWrapper({ children }: { children: React.ReactNode }) {
    const [showDesktopVersionScreen, setShowDesktopVersionScreen] = useState(false);
    const routes = ["/login", "/onboarding"];
    const pathname = usePathname();

    useEffect(() => {
        if (!routes.includes(pathname)) {
            setShowDesktopVersionScreen(true);
        } else {
            setShowDesktopVersionScreen(false);
        }
    }, [pathname]);

    return (
        <>
            {showDesktopVersionScreen && <DesktopVersionScreen />}
            {children}
        </>
    );
}
