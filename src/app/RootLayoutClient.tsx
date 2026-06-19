"use client";

import dynamic from "next/dynamic";
import QueryProvider from "@/providers/QueryWrapper";
import { Suspense } from "react";
import useAutoLogout from "@/hooks/useAutoLogout";
import useMobileInit from "@/hooks/useMobileInit";
import { useRouter } from "next/navigation";
import RouteGuard from "@/components/guards/RouteGuard";
import NetworkStatus from "@/components/common/NetworkStatus";

const LottieLoader = dynamic(
    () => import("@/components/common/Loader/Lottie").then((m) => m.default),
    { ssr: false }
);

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useAutoLogout(router);
    useMobileInit();

    return (
        <Suspense
            fallback={
                <div className="h-[100vh] w-[100vw] flex-center">
                    <LottieLoader isLoading={true} />
                </div>
            }
        >
            <NetworkStatus />
            <QueryProvider>
                <RouteGuard>{children}</RouteGuard>
            </QueryProvider>
        </Suspense>
    );
}