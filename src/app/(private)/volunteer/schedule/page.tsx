"use client";

import Calendar from "@/components/schedule/Calender";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";

export default function SchedulePage() {
    return (
        <div className="w-full h-full">
            <Calendar />
            <MyScheduleModal />
        </div>
    );
}
