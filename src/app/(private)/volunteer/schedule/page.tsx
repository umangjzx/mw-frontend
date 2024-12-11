"use client";

import Calendar from "@/components/schedule/Calender";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SchedulePage() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleModal = () => {
        isOpen ? router.push("/volunteer/schedule") : setIsOpen(!isOpen);
    };

    const modal = searchParams.get("modal");
    console.log(modal, "modal schedule");

    useEffect(() => {
        if (modal === "my_schedule") {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-full">
            <Calendar />
            <MyScheduleModal isOpen={isOpen} onClose={handleModal} />
        </div>
    );
}
