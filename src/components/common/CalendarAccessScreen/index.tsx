"use client";
import { CalendarAccessIcon } from "@/assets/icons";
import React from "react";
import Button from "@/components/common/Button";
import { revokeGoogleAuth } from "@/utils/calender";
import { useRouter } from "next/navigation";

const CalendarAccessScreen = () => {
    const router = useRouter();
    const handleRevokeCalendarScope = () => {
        revokeGoogleAuth().then((res) => {
            console.log(res, "REVOKE RESPONSE");
            router.push(res?.data?.auth_uri);
        });
    };

    return (
        <div className="w-full h-full">
            <div className="flex flex-col h-full gap-4 justify-center items-center">
                <span>
                    <CalendarAccessIcon />
                </span>
                <h3 className="text-xl font-medium">Link Your Google Calendar to Stay Organized</h3>
                <p className="text-sm text-gray-500">
                    You haven’t linked your Google Calendar yet. Connect it now to schedule and
                    manage sessions seamlessly within the application.
                </p>
                <Button
                    title="Link Google Calendar"
                    className="!bg-background-secondary !text-black !text-sm !border-none w-fit"
                    onClick={handleRevokeCalendarScope}
                />
            </div>
        </div>
    );
};

export default CalendarAccessScreen;
