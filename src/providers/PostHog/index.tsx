"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { POSTHOG_API_KEY, POSTHOG_HOST } from "@/definitions";
import { isNativePlatform } from "@/utils/platform";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Skip PostHog on native platforms - use Firebase Analytics instead
        if (isNativePlatform()) return;

        if (typeof window !== "undefined" && !posthog.__loaded && POSTHOG_API_KEY) {
            posthog.init(POSTHOG_API_KEY, {
                api_host: POSTHOG_HOST,
                capture_pageview: false,
            });
        }
    }, []);

    useEffect(() => {
        if (isNativePlatform()) return;
        posthog.capture("$pageview");
    }, [pathname]);

    return <>{children}</>;
}
