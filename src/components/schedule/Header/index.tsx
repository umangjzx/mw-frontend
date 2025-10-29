"use client";

import Button from "@/components/common/Button";
import MonthYearSlider from "./MonthYearSlider";
import { CalendarDayOne, CalendarIcon, NotificationIcon, SideMenuIcon } from "@/assets/icons";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import InnerWidth from "@/utils/innerWidth";
import MonthYearPicker from "./MonthYearPicker";
import SideModal from "@/components/common/Modals/MobileSideModal";
import Sidebar from "@/components/common/Sidebar";
import { useState } from "react";
import { VIEW_DEMO_LINK, VIEW_DEMO_LINK_FOR_VOLUNTEER } from "@/definitions";
import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import { useQuery } from "@tanstack/react-query";

type Props = {};

const Header = (props: Props) => {
    const role = Cookies.get("role");
    const router = useRouter();
    const volunteerId = Cookies.get("volunteer_id");
    const [isSideNavBarOpen, setIsSideNavBarOpen] = useState<boolean>(false);

    const getUnreadCount = async () => {
        const res: any = await GET_API(endpoints.session.getUnreadCount(volunteerId as string));
        return res?.data;
    };

    const { data } = useQuery({
        queryKey: ["unread-count"],
        queryFn: getUnreadCount,
    });

    console.log(data?.unread_count, "unreadCount");

    const innerWidth = InnerWidth();
    const isMobileOrTabScreen = innerWidth < 1024;

    const handleAddMeeting = () => {
        router.push("/learner/schedule?modal=add_new_meeting");
    };

    const handleMySchedule = () => {
        router.push("/volunteer/schedule?modal=my_schedule");
    };

    const handleNotification = () => {
        router.push("/volunteer/schedule?modal=approval_notification");
    };

    const handleViewDemo = () => {
        if (typeof window !== "undefined") {
            window.open(VIEW_DEMO_LINK, "_blank");
            console.log(VIEW_DEMO_LINK);
        }
    };

    const handleViewDemoforvolunteer=()=>{
        if(typeof window !== "undefined"){
            window.open(VIEW_DEMO_LINK_FOR_VOLUNTEER, "_blank");
            console.log(VIEW_DEMO_LINK_FOR_VOLUNTEER)
        }
    }

    return (
        <div className="w-full h-full p-2 px-3">
            <div className="w-full h-full md:flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div
                            className="lg:hidden cursor-pointer"
                            onClick={() => setIsSideNavBarOpen(true)}
                        >
                            <SideMenuIcon height="22px" width="22px" />
                        </div>
                        <Button
                            onClick={() => {}}
                            title="My Schedule"
                            icon={isMobileOrTabScreen ? "" : <CalendarIcon />}
                            rootClassName="bg-transparent text-xl border-none font-medium shadow-none max-lg:!px-2"
                        />
                    </div>
                    {role === "volunteer" && (
                        <Button
                            onClick={handleNotification}
                            icon={<NotificationIcon height="21px" width="21px" />}
                            customClassName="lg:hidden !border-none !bg-transparent font-semibold !text-black rounded-full !p-0"
                        />
                    )}
                </div>
                <div className="max-lg:hidden flex items-center gap-4">
                    <MonthYearSlider
                        onChange={(date) => {
                            console.log(date, "date from month year slider");
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 max-lg:mt-1">
                    {isMobileOrTabScreen && <MonthYearPicker />}
                    {role === "learner" ? (
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleViewDemo}
                                title="View Demo"
                                customClassName="!bg-white max-lg:!text-sm !font-medium !text-black rounded-full p-1 lg:!p-3"
                            />
                            <Button
                                onClick={handleAddMeeting}
                                title="Add New Meeting"
                                customClassName="!bg-black max-lg:!text-sm !font-medium !text-white rounded-full p-1 lg:!p-3"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {!isMobileOrTabScreen && (
                                <div className="relative gap-2 flex items-center">
                                     <Button
                                onClick={handleViewDemoforvolunteer}
                                title="View Demo"
                                customClassName="!bg-white max-lg:!text-sm !font-medium !text-black rounded-full lg:!p-3  !py-3 !px-3"
                            />
                                    <Button
                                        onClick={handleNotification}
                                        icon={<NotificationIcon />}
                                        customClassName="!bg-transparent font-semibold !text-black rounded-full !py-3 !px-3"
                                    />
                                    {data?.unread_count > 0 && (
                                        <div className="absolute -top-2.5 -right-1.5 p-1 px-2 rounded-full flex items-center justify-center text-white text-xs font-medium bg-red-500">
                                            {data?.unread_count}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Button
                                onClick={handleMySchedule}
                                title="Schedule my availability"
                                customClassName="!bg-transparent font-medium !text-black rounded-full !py-3 !px-3"
                            />
                        </div>
                    )}
                </div>
            </div>
            {isMobileOrTabScreen && (
                <SideModal isOpen={isSideNavBarOpen}>
                    <Sidebar onClose={() => setIsSideNavBarOpen(!isSideNavBarOpen)} />
                </SideModal>
            )}
        </div>
    );
};

export default Header;
