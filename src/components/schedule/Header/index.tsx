"use client";

import Button from "@/components/common/Button";
import MonthYearSlider from "./MonthYearSlider";
import { CalendarDayOne, CalendarIcon, NotificationIcon } from "@/assets/icons";
import { IoIosSearch } from "react-icons/io";
import { getLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";

type Props = {};

const Header = (props: Props) => {
    const role = getLocalStorage("role");
    const router = useRouter();

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
        <div className="w-full h-full p-2 px-3 flex items-center justify-between">
            <Button
                onClick={() => {}}
                title="Schedule"
                icon={<CalendarIcon />}
                rootClassName="bg-transparent border-none font-medium shadow-none"
            />
            <div className="flex items-center gap-4">
                <MonthYearSlider
                    onChange={(date) => {
                        console.log(date, "date from month year slider");
                    }}
                />
                <Button
                    onClick={() => {}}
                    title="Today"
                    icon={<CalendarDayOne />}
                    rootClassName="bg-transparent font-medium rounded-full shadow-none"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => {}}
                    icon={<IoIosSearch className="text-xl" />}
                    customClassName="!bg-transparent font-semibold !text-black rounded-full !py-3 !px-3"
                />
                {role === "learner" ? (
                    <Button
                        onClick={handleAddMeeting}
                        title="Add New Meeting"
                        customClassName="!bg-black font-medium !text-white rounded-full !py-3 !px-3"
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleNotification}
                            icon={<NotificationIcon />}
                            customClassName="!bg-transparent font-semibold !text-black rounded-full !py-3 !px-3"
                        />
                        <Button
                            onClick={handleMySchedule}
                            title="My Schedule"
                            customClassName="!bg-transparent font-medium !text-black rounded-full !py-3 !px-3"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
