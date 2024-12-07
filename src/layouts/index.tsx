"use client";

import Sidebar from "@/components/common/Sidebar";
import { FC, PropsWithChildren } from "react";
import { renderHeader } from "./helper";
import { usePathname } from "next/navigation";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const header = renderHeader(pathname);

    return (
        <div className='h-screen w-screen overflow-hidden'>
            <div className='grid grid-cols-12'>
                <div className='col-span-2'>
                    <Sidebar />
                </div>
                <div className='col-span-10 h-full bg-white'>
                    <div className='h-[10vh] w-full'>{header}</div>
                    <div className='w-full rounded-tl-[50px] bg-background-input h-[90vh] overflow-y-auto'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
