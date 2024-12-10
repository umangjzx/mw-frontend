"use client";
import VolunteerViewModal from "@/components/leaner/VolunteerViewModal";
import SideModal from "@/components/common/Modals/SideModal";
import { LearnerScheduleModalConstants } from "@/constants/schedule";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useState } from "react";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import AddNewMeetingModal from "@/components/schedule/Modals/AddNewMeetingModal";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getHeaderIcon } from "@/layouts/helper";
import { useAppStore } from "@/store/useAppStore";

const Profile = () => {
    const pathname = usePathname();
    const { setHeaderOptions } = useAppStore();

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Search",
            actionButtonTitle: "Add new post",
            actionButtonOnClick: () => {},
            actionButtonClassName:
                "!bg-background-secondary hover:!border-none !text-black !rounded-xl hover:!bg-background-secondary hover:!text-black !h-[35px] !text-xs !py-2 px-4",
            actionButtonPlacement: "right",
            hideButton: false,
            title: "Community",
            titleIcon: getHeaderIcon(pathname),
        });
    }, [pathname, setHeaderOptions]);

    return (
        <div className="h-[100vh] bg-[#f4f7fb]">
            <div className="h-[10vh] w-full"></div>
            <div className="h-[90vh] w-full grid grid-cols-[1fr,2fr] gap-10 p-5">
                <Bio />
                <Overview />
            </div>
        </div>
    );
};

export default Profile;
