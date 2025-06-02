"use client";
import { endpoints } from "@/api/constants";
import { GET_API, PUT_API } from "@/api/request";
import SideModal from "@/components/common/Modals/SideModal";
import { useEffect, useState } from "react";
import TrashIcon from "@/assets/icons/TrashIcon";
import cn from "classnames";
import dayjs from "dayjs";
import AddSlotIcon from "@/assets/icons/AddSlotIcon";
import { useSendData } from "@/hooks/useReactQuery";
import { generateTimeSlotId } from "@/utils/timeFunctions";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { showToast } from "@/components/common/Toast";
import { useQueryClient } from "@tanstack/react-query";

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

const MyScheduleModal: React.FC<MyScheduleModalProps> = ({ isOpen, onClose }) => {
    const [schedule, setSchedule] = useState<DaySchedule>({
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [deletedSlots, setDeletedSlots] = useState<string[]>([]);
    const queryClient = useQueryClient();

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

    // Add this useEffect to check for overlapping times whenever schedule changes
    useEffect(() => {
        const newErrors: { [key: string]: string[] } = {};

        days.forEach((day) => {
            const dayErrors: string[] = [];
            schedule[day].forEach((slot, index) => {
                if (slot.start_time && slot.end_time) {
                    if (isTimeOverlapping(day, slot.start_time, slot.end_time, index)) {
                        dayErrors.push(`Time slot ${index + 1} overlaps with another slot`);
                    }
                }
            });
            if (dayErrors.length > 0) {
                newErrors[day] = dayErrors;
            }
        });

        setErrors(newErrors);
    }, [schedule]);

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

    // Modify handleTimeChange to remove error handling since it's now handled by useEffect
    const handleTimeChange = (
        day: string,
        slotIndex: number,
        type: "start_time" | "end_time",
        value: string | null
    ) => {
        const updatedSlot = {
            ...schedule[day][slotIndex],
            [type]: value ? dayjs(value, "HH:mm").format("HH:mm") : "",
        };

        if (
            updatedSlot.start_time &&
            updatedSlot.end_time &&
            dayjs(updatedSlot.start_time, "HH:mm").isAfter(dayjs(updatedSlot.end_time, "HH:mm"))
        ) {
            const temp = updatedSlot.start_time;
            updatedSlot.start_time = updatedSlot.end_time;
            updatedSlot.end_time = temp;
            console.log("Swapped start_time and end_time due to invalid order");
        }

        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day]
                .map((slot, index) => (index === slotIndex ? updatedSlot : slot))
                .sort((a, b) =>
                    type === "start_time"
                        ? 0
                        : dayjs(a.start_time, "HH:mm").isBefore(dayjs(b.start_time, "HH:mm"))
                        ? -1
                        : 1
                ),
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
    };

    const formatScheduleForAPI = (): APIScheduleFormat[] => {
        console.log("formatScheduleForAPI schedule", schedule);
        return days.map((day) => ({
            day,
            slots: schedule[day]
                .filter((slot) => slot.start_time && slot.end_time) // Only include filled slots
                .map((slot) => {
                    return {
                        volunteer_slot_id: generateTimeSlotId(slot.start_time, slot.end_time),
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                    };
                }),
        }));
    };

    const handleSave = async () => {
        const formattedData = formatScheduleForAPI();
        const payload = {
            deleted_slots: deletedSlots,
            slots: formattedData,
        };
        console.log("formattedData schedule", formattedData);
        const res = await PUT_API(endpoints.volunteer_slot.update, payload);
        if (res?.status === 201) {
            showToast({ message: "Schedule updated successfully", type: "success" });
        } else {
            showToast({ message: "Failed to update schedule", type: "error" });
        }
        return res;
    };

    const { mutate: onSave, isPending } = useSendData({
        fn: () => handleSave(),
        invalidateKey: ["volunteer_slot"],
        success: () => {
            setDeletedSlots([]);
            onClose();
            queryClient.invalidateQueries({ queryKey: ["volunteer-events"] });
        },
        error: (err) => {
            console.log("Error: ", err);
        },
    });

    // Add this CSS class to style the TimePicker input
    const timePickerClass = cn("!text-sm");

    // Add this function to check if there are any errors
    const hasErrors = () => {
        return Object.values(errors).some((dayErrors) => dayErrors.length > 0);
    };

    const TimePickerComponent = ({
        day,
        slot,
        slotIndex,
        type,
    }: {
        day: string;
        slot: TimeSlot;
        slotIndex: number;
        type: "start_time" | "end_time";
    }) => {
        const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(
            type === "start_time"
                ? slot.start_time
                    ? dayjs(slot.start_time, "HH:mm")
                    : null
                : slot.end_time
                ? dayjs(slot.end_time, "HH:mm")
                : null
        );

        const [tempTime, setTempTime] = useState<dayjs.Dayjs | null>(selectedTime);

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                    timeSteps={{ minutes: 1 }}
                    format="h:mm A"
                    value={tempTime}
                    onChange={(time) => setTempTime(time)}
                    onAccept={() => {
                        if (tempTime) {
                            setSelectedTime(tempTime);
                            handleTimeChange(day, slotIndex, type, tempTime.format("HH:mm"));
                        }
                    }}
                    closeOnSelect={false}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "2px solid var(--background-secondary-color) !important",
                            },
                        },
                    }}
                    className={cn(
                        timePickerClass,
                        errors[day]?.some((error) =>
                            error.includes(`Time slot ${slotIndex + 1}`)
                        ) && "border-red-500"
                    )}
                />
            </LocalizationProvider>
        );
    };

    return (
        <SideModal
            title="My Schedule"
            onClose={onClose}
            saveButtonText="Save Schedule"
            cancelButtonText="Cancel"
            isOpen={isOpen}
            onSave={() => onSave({})}
            onCancel={onClose}
            isDisabled={hasErrors()}
            isLoading={isPending}
            modalWidth={430}
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
                                    <p className="font-semibold w-[2rem]">{day.slice(0, 3)}</p>
                                    <div className="flex flex-col items-center gap-2 w-full px-1">
                                        {schedule[day].length > 0 ? (
                                            schedule[day].map((slot, slotIndex) => (
                                                <div
                                                    key={slotIndex}
                                                    className="flex flex-col gap-2"
                                                >
                                                    <div
                                                        key={slotIndex}
                                                        className="flex gap-2 items-center"
                                                    >
                                                        <div>
                                                            <TimePickerComponent
                                                                day={day}
                                                                slot={slot}
                                                                slotIndex={slotIndex}
                                                                type="start_time"
                                                            />
                                                        </div>
                                                        <p className="text-sm font-medium">to</p>
                                                        <div>
                                                            <TimePickerComponent
                                                                day={day}
                                                                slot={slot}
                                                                slotIndex={slotIndex}
                                                                type="end_time"
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
                                                    {errors[day]?.map(
                                                        (error, errorIndex) =>
                                                            error.includes(
                                                                `Time slot ${slotIndex + 1}`
                                                            ) && (
                                                                <p
                                                                    key={errorIndex}
                                                                    className="text-xs text-red-500"
                                                                >
                                                                    {error}
                                                                </p>
                                                            )
                                                    )}
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
