import { formatTime } from "@/utils/calender";
import { Radio, Skeleton } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useAppStore } from "@/store/useAppStore";
dayjs.extend(utc);
dayjs.extend(timezone);

const AvailableSlotsRadioGroup: React.FC<AvailableSlotsRadioGroupProps> = ({
    availableSlots,
    selectedSlot,
    onSlotSelect,
    errors,
    slotError,
    fetchingSlots,
    selectedDate,
    volunteerTimezone,
}) => {
    const [isSlotsAvailable, setIsSlotsAvailable] = useState(false);
    console.log("availableSlots", availableSlots);


    const role = Cookies.get("role");
    const volunteerId = Cookies.get("volunteer_id");
    const learnerId = Cookies.get("learner_id");
    const isVolunteer = role === "volunteer";



    const getUserDetails = async () => {
        const endpoint = isVolunteer
            ? endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
            : endpoints.learner.getIndividualLearner(learnerId as string);
        const { status, data } = await GET_API(endpoint);

        if (status !== 200 || !data) return null;


        return data;
    };

    const queryKey = isVolunteer
        ? ["volunteerDetails", volunteerId]
        : ["learnerDetails", learnerId];
    const { data } = useQuery({
        queryKey: queryKey,
        queryFn: async () => await getUserDetails(),
    });
    const timezoneMapping: Record<string, string> = {
        AKST: "America/Anchorage",
        AST: "America/Halifax",
        CST: "America/Chicago",
        EST: "America/New_York",
        HST: "Pacific/Honolulu",
        MST: "America/Denver",
        NST: "America/St_Johns",
        PST: "America/Los_Angeles",
        IST: "Asia/Kolkata",
    };

    const userProfileTimezone = isVolunteer
        ? data?.volunteer_contact_details?.timezone
        : data?.learner_personal_info?.learner_contact_details?.timezone;

    // Handle full timezone strings like "MST - Mountain Standard Time (UTC-07:00)"
    const tzKey = userProfileTimezone?.split(" - ")[0] || "";
    const userIANA = (tzKey && timezoneMapping[tzKey]) || (userProfileTimezone && !userProfileTimezone.includes(" ") ? userProfileTimezone : dayjs.tz.guess());

    const filteredSlots = availableSlots.filter((slot) => {
        if (!selectedDate) return true;

        const now = dayjs().tz(userIANA);
        const todayStr = now.format("YYYY-MM-DD");

        // Filter out past dates
        if (selectedDate < todayStr) return false;

        if (selectedDate === todayStr) {
            const [hours, minutes] = slot.start_time.split(":").map(Number);
            const slotStartTime = now.clone().hour(hours).minute(minutes).second(0).millisecond(0);

            return slotStartTime.isAfter(now);
        }
        return true;
    });

    useEffect(() => {
        setIsSlotsAvailable(filteredSlots.length > 0);
    }, [availableSlots, filteredSlots.length]);

    if (!isSlotsAvailable) {
        return (
            <div>
                {slotError ? (
                    <p className="text-xs font-normal -mt-2 mb-2 text-red-500">{slotError}</p>
                ) : (
                    <p className="text-xs font-normal mb-2 -mt-2 text-gray-400">
                        {fetchingSlots ? (
                            <span>Fetching slots...</span>
                        ) : selectedDate ? (
                            <span>No future slots available for this date.</span>
                        ) : (
                            <span>To see available slots, select a volunteer and date.</span>
                        )}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <p className="text-sm font-medium mb-2">Available Slots:</p>
            <Radio.Group
                size="small"
                onChange={(e) => {
                    const selectedSlot = filteredSlots.find(
                        (slot) => slot.volunteer_slot_id === e.target.value
                    );
                    if (selectedSlot) {
                        onSlotSelect(
                            e.target.value,
                            selectedSlot.start_time,
                            selectedSlot.end_time
                        );
                    }
                }}
                value={selectedSlot}
            >
                <div className="flex gap-3 flex-wrap">
                    {filteredSlots.map((slot) => (
                        <Radio
                            key={slot.volunteer_slot_id}
                            value={slot.volunteer_slot_id}
                            className="text-sm !text-[#16A34A] font-medium underline whitespace-nowrap"
                        >
                            {`${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}
                        </Radio>
                    ))}
                </div>
            </Radio.Group>
            {isSlotsAvailable && <p className="text-xs text-red-500 mt-1">{errors}</p>}
        </div>
    );
};

export default AvailableSlotsRadioGroup;
