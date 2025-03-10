"use client";

import QueryProvider from "@/providers/QueryWrapper";
import { Suspense } from "react";
import LottieLoader from "@/components/common/Loader/Lottie";
import useAutoLogout from "@/hooks/useAutoLogout";
import { useRouter } from "next/navigation";

export default function RootLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    // Hook to auto logout user if they are idle for 30 minutes
    useAutoLogout(router);
    
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