"use client";

import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function ProfilePage () {
    const { setHeaderOptions } = useAppStore();
    const router = useRouter()

    const handleBackClick = () => {
        router.back()
    }

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className='text-lg' />,
            titleIconClick: handleBackClick,
            hideButton: true
        });
    }, []);

    return <div>Profile</div>;
}
