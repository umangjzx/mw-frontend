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

type Props = {};

const Header = (props: Props) => {
    const role = Cookies.get("role");
    const router = useRouter();
    const [isSideNavBarOpen, setIsSideNavBarOpen] = useState<boolean>(false);

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

    return (
        <div className="w-full h-full p-2 px-3">
            <div className="w-full h-full md:flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="lg:hidden cursor-pointer" onClick={() => setIsSideNavBarOpen(true)}>
                            <SideMenuIcon height="22px" width="22px" />
                        </div>
                        <Button
                            onClick={() => { }}
                            title="Schedule"
                            icon={isMobileOrTabScreen ? "" : <CalendarIcon />}
                            rootClassName="bg-transparent text-xl border-none font-medium shadow-none max-lg:!px-2"
                        />
                    </div>
                    {role === "volunteer" &&
                        <Button
                            onClick={handleNotification}
                            icon={<NotificationIcon height="21px" width="21px" />}
                            customClassName="lg:hidden !border-none !bg-transparent font-semibold !text-black rounded-full !p-0"
                        />
                    }
                </div>
                <div className="max-lg:hidden flex items-center gap-4">
                    <MonthYearSlider
                        onChange={(date) => {
                            console.log(date, "date from month year slider");
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 max-lg:mt-1">
                    {
                        isMobileOrTabScreen &&
                        <MonthYearPicker />
                    }
                    {role === "learner" ? (
                        <Button
                            onClick={handleAddMeeting}
                            title="Add New Meeting"
                            customClassName="!bg-black max-lg:!text-sm !font-medium !text-white rounded-full p-1 lg:!p-3"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            {
                                !isMobileOrTabScreen &&
                                <Button
                                    onClick={handleNotification}
                                    icon={<NotificationIcon />}
                                    customClassName="!bg-transparent font-semibold !text-black rounded-full !py-3 !px-3"
                                />
                            }
                            <Button
                                onClick={handleMySchedule}
                                title="My Schedule"
                                customClassName="!bg-transparent font-medium !text-black rounded-full !py-3 !px-3"
                            />
                        </div>
                    )}
                </div>
            </div>
            {
                isMobileOrTabScreen &&
                <SideModal isOpen={isSideNavBarOpen}>
                    <Sidebar onClose={() => setIsSideNavBarOpen(!isSideNavBarOpen)} />
                </SideModal>
            }
        </div>
    );
};

export default Header;
