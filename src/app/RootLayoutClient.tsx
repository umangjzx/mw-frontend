"use client";

import QueryProvider from "@/providers/QueryWrapper";
import { Suspense } from "react";
import LottieLoader from "@/components/common/Loader/Lottie";

export default function RootLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense
            fallback={
                <div className="h-[100vh] w-[100vw] flex-center">
                    <LottieLoader isLoading={true} />
                </div>
            }
        >
            <QueryProvider>
                {children}
            </QueryProvider>
        </Suspense>
    );
}