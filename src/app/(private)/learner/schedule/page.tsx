"use client";

import Calendar from "@/components/schedule/Calender";
import AddNewMeetingModal from "@/components/schedule/Modals/AddNewMeetingModal";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SchedulePage() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleModal = () => {
        isOpen ? router.push("/learner/schedule") : setIsOpen(!isOpen);
    };

    useEffect(() => {
        const modal = searchParams.get("modal");
        if (modal === "add_new_meeting") {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-full">
            <AddNewMeetingModal isOpen={isOpen} onClose={handleModal} />
            <Calendar />
            <MyScheduleModal />
        </div>
    );
}
