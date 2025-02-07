"use client";

import Sidebar from "@/components/common/Sidebar";
import { FC, PropsWithChildren } from "react";
import { renderHeader } from "./helper";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/merge-class";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const header = renderHeader(pathname);
    const isProfile = pathname.includes("profile");

    return (
        <div className='h-[100dvh] w-screen overflow-hidden flex'>
            {!isProfile && (
                <div className='max-lg:hidden w-1/6'>
                    <Sidebar />
                </div>
            )}

            <div
                className={cn(
                    "flex flex-col w-full bg-white",
                    isProfile ? "w-full" : "lg:w-5/6"
                )}
            >
                <div className='w-full lg:min-h-[10vh]'>{header}</div>
                <div
                    className={cn(
                        "flex-grow overflow-y-auto bg-background-input",
                        isProfile ? "" : "lg:rounded-tl-[50px]"
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;