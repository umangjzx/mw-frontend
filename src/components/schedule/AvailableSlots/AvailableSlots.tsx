import { formatTime } from "@/utils/calender";
import { Radio, Skeleton } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone";

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

    // Filter slots that are in the past if the selected date is today
    const filteredSlots = availableSlots.filter((slot) => {
        if (!selectedDate) return true;

        const now = dayjs(); // User's local time
        const todayStr = now.format("YYYY-MM-DD");

        if (selectedDate === todayStr) {
            // Combine date and time (assuming slot.start_time is HH:mm)
            // We compare it as if it's in the user's local timezone
            const [hours, minutes] = slot.start_time.split(":").map(Number);
            const slotStartTime = now
                .clone()
                .hour(hours)
                .minute(minutes)
                .second(0)
                .millisecond(0);

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
