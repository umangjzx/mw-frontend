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
        <div className='h-screen w-screen overflow-hidden'>
            <div className='grid grid-cols-12'>
                <div hidden={isProfile} className='max-lg:hidden col-span-2'>
                    <Sidebar />
                </div>
                <div className={cn("h-full bg-white", isProfile ? "col-span-12" : "col-span-12 lg:col-span-10")}>
                    <div className='lg:h-[10vh] w-full'>{header}</div>
                    <div
                        className={cn(
                            "w-full bg-background-input h-[90vh] overflow-y-auto",
                            isProfile ? "" : "lg:rounded-tl-[50px]"
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
