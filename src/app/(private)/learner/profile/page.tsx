"use client";

import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";

export default function ProfilePage() {
    const { setHeaderOptions } = useAppStore();
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className="text-lg" />,
            titleIconClick: handleBackClick,
            hideButton: true,
        });
    }, []);

    return (
        <div className="h-full">
            <div className="h-full w-full grid grid-cols-[1fr,2fr] gap-10 p-5">
                <Bio />
                <Overview />
            </div>
        </div>
    );
}
