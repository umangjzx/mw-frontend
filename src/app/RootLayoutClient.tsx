"use client";

import dynamic from "next/dynamic";
import QueryProvider from "@/providers/QueryWrapper";
import { Suspense } from "react";
import useAutoLogout from "@/hooks/useAutoLogout";
import { useRouter } from "next/navigation";

const LottieLoader = dynamic(
    () => import("@/components/common/Loader/Lottie").then((m) => m.default),
    { ssr: false }
);

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useAutoLogout(router);

    return (
        <Suspense
            fallback={
                <div className="h-[100vh] w-[100vw] flex-center">
                    {/* <LottieLoader isLoading={true} /> */}
                </div>
            }
        >
            <QueryProvider>{children}</QueryProvider>
        </Suspense>
    );
}