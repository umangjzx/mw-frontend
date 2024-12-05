"use client";
import { endpoints } from "@/api/constants";
import { GetAPI, PutAPI } from "@/api/request";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

const Schedule = () => {
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

    useEffect(() => {
        GetAPI(endpoints.volunteer_slot.get).then((res: any) => {
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

            // Ensure each day has at least one empty slot if no slots exist
            days.forEach((day) => {
                if (newSchedule[day].length === 0) {
                    newSchedule[day] = [{ volunteer_slot_id: "", start_time: "", end_time: "" }];
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
        value: string
    ) => {
        const updatedSlot = {
            ...schedule[day][slotIndex],
            [type]: value,
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
        PutAPI(endpoints.volunteer_slot.update, payload).then((res) => {
            console.log(res, "res");
            setDeletedSlots([]);
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-4">
                {days.map((day) => (
                    <div key={day} className="flex flex-col gap-2">
                        <p className="font-semibold">{day}</p>
                        <div className="flex flex-col gap-2 ml-4">
                            {schedule[day].map((slot, slotIndex) => (
                                <div key={slotIndex} className="flex flex-col gap-2">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex gap-2 items-center">
                                            <p>From</p>
                                            <input
                                                type="time"
                                                className={`border rounded px-2 py-1 ${
                                                    errors[day]?.some((error) =>
                                                        error.includes(`Time slot ${slotIndex + 1}`)
                                                    )
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                value={slot.start_time}
                                                onChange={(e) =>
                                                    handleTimeChange(
                                                        day,
                                                        slotIndex,
                                                        "start_time",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p>To</p>
                                            <input
                                                type="time"
                                                value={slot.end_time}
                                                className={`border rounded px-2 py-1 ${
                                                    errors[day]?.some((error) =>
                                                        error.includes(`Time slot ${slotIndex + 1}`)
                                                    )
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                onChange={(e) =>
                                                    handleTimeChange(
                                                        day,
                                                        slotIndex,
                                                        "end_time",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        {schedule[day].length > 1 && (
                                            <button
                                                onClick={() => removeTimeSlot(day, slotIndex)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    {errors[day]?.some((error) =>
                                        error.includes(`Time slot ${slotIndex + 1}`)
                                    ) && (
                                        <p className="text-red-500 text-sm">
                                            This time slot overlaps with another slot
                                        </p>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => addTimeSlot(day)}
                                className="text-blue-500 hover:text-blue-700 w-fit"
                            >
                                + Add another time slot
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Save Schedule
                </button>
            </div>
        </div>
    );
};

export default Schedule;
