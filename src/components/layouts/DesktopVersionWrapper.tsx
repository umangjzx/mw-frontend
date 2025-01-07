"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DesktopVersionScreen from "@/components/common/DesktopVersionScreen";
import useInnerWidth from "@/hooks/useInnerWidth";

export default function DesktopVersionWrapper({ children }: { children: React.ReactNode }) {
    const [showDesktopVersionScreen, setShowDesktopVersionScreen] = useState(false);
    const routes = ["/login", "/onboarding"];
    const pathname = usePathname();
    const innerWidth = useInnerWidth();

    useEffect(() => {
        if (!routes.includes(pathname) && innerWidth < 768) {
            setShowDesktopVersionScreen(true);
        } else {
            setShowDesktopVersionScreen(false);
        }
    }, [pathname, innerWidth]);

    return <>{showDesktopVersionScreen ? <DesktopVersionScreen /> : children}</>;
}
