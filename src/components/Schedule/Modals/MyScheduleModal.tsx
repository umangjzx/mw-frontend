"use client";
import { endpoints } from "@/api/constants";
import { GET_API, PUT_API } from "@/api/request";
import SideModal from "@/components/common/Modals/SideModal";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TrashIcon from "@/assets/icons/TrashIcon";
import { TimePicker } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import AddSlotIcon from "@/assets/icons/AddSlotIcon";

interface TimeSlot {
    start_time: string;
    end_time: string;
    volunteer_slot_id?: string;
}

interface DaySchedule {
    [key: string]: TimeSlot[];
}

interface APITimeSlot {
    start_time: string;
    end_time: string;
}

interface APIScheduleFormat {
    day: string;
    slots: APITimeSlot[];
}

const MyScheduleModal = () => {
    const [formData, setFormData] = useState<any>({});
    const [schedule, setSchedule] = useState<DaySchedule>({
        Sun: [],
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [deletedSlots, setDeletedSlots] = useState<string[]>([]);

    useEffect(() => {
        GET_API(endpoints.volunteer_slot.get).then((res: any) => {
            const newSchedule = { ...schedule };

            // Initialize all days with empty arrays
            days.forEach((day) => {
                newSchedule[day] = [];
            });

            // Populate the schedule with API data
            res.data.forEach((dayData: any) => {
                if (dayData.slots && dayData.slots.length > 0) {
                    newSchedule[dayData.day] = dayData.slots.map((slot: any) => ({
                        volunteer_slot_id: slot.volunteer_slot_id,
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                    }));
                }
            });

            setSchedule(newSchedule);
        });
    }, []);

    const isTimeOverlapping = (
        day: string,
        newFrom: string,
        newTo: string,
        currentIndex: number
    ): boolean => {
        if (!newFrom || !newTo) return false;

        const newFromMinutes = convertTimeToMinutes(newFrom);
        const newToMinutes = convertTimeToMinutes(newTo);

        return schedule[day].some((slot, index) => {
            if (index === currentIndex || !slot.start_time || !slot.end_time) return false;

            const existingFromMinutes = convertTimeToMinutes(slot.start_time);
            const existingToMinutes = convertTimeToMinutes(slot.end_time);

            return (
                (newFromMinutes >= existingFromMinutes && newFromMinutes < existingToMinutes) ||
                (newToMinutes > existingFromMinutes && newToMinutes <= existingToMinutes) ||
                (newFromMinutes <= existingFromMinutes && newToMinutes >= existingToMinutes)
            );
        });
    };

    const convertTimeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const handleTimeChange = (
        day: string,
        slotIndex: number,
        type: "start_time" | "end_time",
        value: string | null
    ) => {
        const updatedSlot = {
            ...schedule[day][slotIndex],
            [type]: value ? value : "",
        };

        // Check for overlap only if both from and to times are set
        if (updatedSlot.start_time && updatedSlot.end_time) {
            if (isTimeOverlapping(day, updatedSlot.start_time, updatedSlot.end_time, slotIndex)) {
                setErrors((prev) => ({
                    ...prev,
                    [day]: [
                        ...(prev[day] || []),
                        `Time slot ${slotIndex + 1} overlaps with another slot`,
                    ],
                }));
                return;
            }

            // Clear errors if no overlap
            setErrors((prev) => ({
                ...prev,
                [day]: (prev[day] || []).filter(
                    (error) => !error.includes(`Time slot ${slotIndex + 1}`)
                ),
            }));
        }

        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].map((slot, index) => (index === slotIndex ? updatedSlot : slot)),
        }));
    };

    const addTimeSlot = (day: string) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: [...prev[day], { start_time: "", end_time: "" }],
        }));
    };

    const removeTimeSlot = (day: string, slotIndex: number) => {
        setSchedule((prev) => {
            const slotToRemove = prev[day][slotIndex];
            if (slotToRemove.volunteer_slot_id) {
                setDeletedSlots((prev) => [...prev, slotToRemove.volunteer_slot_id!]);
            }

            return {
                ...prev,
                [day]: prev[day].filter((_, index) => index !== slotIndex),
            };
        });

        // Clear errors for removed slot
        setErrors((prev) => ({
            ...prev,
            [day]: (prev[day] || []).filter(
                (error) => !error.includes(`Time slot ${slotIndex + 1}`)
            ),
        }));
    };

    const formatScheduleForAPI = (): APIScheduleFormat[] => {
        return days.map((day) => ({
            day,
            slots: schedule[day]
                .filter((slot) => slot.start_time && slot.end_time) // Only include filled slots
                .map((slot) => ({
                    volunteer_slot_id: uuidv4(),
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                })),
        }));
    };

    const handleSave = async () => {
        const formattedData = formatScheduleForAPI();
        console.log(deletedSlots, "deletedSlots save");

        const payload = {
            deleted_slots: deletedSlots,
            slots: formattedData,
        };

        console.log(payload, "payload");
        PUT_API(endpoints.volunteer_slot.update, payload).then((res) => {
            console.log(res, "res");
            setDeletedSlots([]);
        });
    };

    // Add this CSS class to style the TimePicker input
    const timePickerClass = cn(
        "w-[6.7rem] font-medium px-3 py-1 hover:bg-background-input bg-background-input rounded-xl [&_.ant-picker-input>input]:!text-sm",
        "ant-picker-small", // This will make the overall picker smaller
        "[&_.ant-picker-panel]:!text-sm", // This affects the dropdown text size
        "[&_.ant-picker-dropdown]:!text-sm" // This affects the dropdown container
    );

    return (
        <SideModal
            title="My Schedule"
            onClose={() => {}}
            saveButtonText="Create Meeting"
            cancelButtonText="Cancel"
            isOpen={true}
        >
            <div>
                <div className="flex flex-col gap-1 px-5 py-4">
                    <p className="font-medium">Date and Time</p>
                    <p className="text-xs text-gray-light">
                        Select the dates and times that you are available teaching in a week.
                    </p>
                </div>
                <div>
                    <div className="flex flex-col gap-10 mt-2">
                        {days.map((day) => (
                            <div key={day} className="flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2 px-5">
                                    <p className="font-semibold w-[2rem]">{day}</p>
                                    <div className="flex flex-col items-center gap-2 w-full">
                                        {schedule[day].length > 0 ? (
                                            schedule[day].map((slot, slotIndex) => (
                                                <div
                                                    key={slotIndex}
                                                    className="flex gap-2 items-center"
                                                >
                                                    <div className="">
                                                        <TimePicker
                                                            use12Hours
                                                            format="h:mm A"
                                                            value={
                                                                slot.start_time
                                                                    ? dayjs(
                                                                          slot.start_time,
                                                                          "HH:mm"
                                                                      )
                                                                    : null
                                                            }
                                                            onChange={(time) =>
                                                                handleTimeChange(
                                                                    day,
                                                                    slotIndex,
                                                                    "start_time",
                                                                    time
                                                                        ? time.format("HH:mm")
                                                                        : null
                                                                )
                                                            }
                                                            className={cn(
                                                                timePickerClass,
                                                                errors[day]?.some((error) =>
                                                                    error.includes(
                                                                        `Time slot ${slotIndex + 1}`
                                                                    )
                                                                ) && "border-red-500"
                                                            )}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium">to</p>
                                                    <div className="">
                                                        <TimePicker
                                                            use12Hours
                                                            format="h:mm A"
                                                            value={
                                                                slot.end_time
                                                                    ? dayjs(slot.end_time, "HH:mm")
                                                                    : null
                                                            }
                                                            onChange={(time) =>
                                                                handleTimeChange(
                                                                    day,
                                                                    slotIndex,
                                                                    "end_time",
                                                                    time
                                                                        ? time.format("HH:mm")
                                                                        : null
                                                                )
                                                            }
                                                            className={cn(
                                                                timePickerClass,
                                                                errors[day]?.some((error) =>
                                                                    error.includes(
                                                                        `Time slot ${slotIndex + 1}`
                                                                    )
                                                                ) && "border-red-500"
                                                            )}
                                                        />
                                                    </div>
                                                    <span
                                                        onClick={() =>
                                                            removeTimeSlot(day, slotIndex)
                                                        }
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <TrashIcon />
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500 font-medium border border-stroke-light text-center rounded-xl px-3 py-1.5 w-[267px]">
                                                No schedules
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        onClick={() => addTimeSlot(day)}
                                        className="text-blue-500 mt-1.5 hover:text-blue-700 w-fit"
                                    >
                                        <AddSlotIcon />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SideModal>
    );
};

export default MyScheduleModal;
