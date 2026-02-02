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
import { convertToUTC, generateTimeSlotId } from "@/utils/timeFunctions";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import CheckIcon from "@/assets/icons/CheckIcon";
import CustomRecurrenceModal from "@/components/schedule/Modals/CustomRecurrenceModal";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { showToast } from "@/components/common/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";

interface TimeSlot {
    start_time: string;
    end_time: string;
    volunteer_slot_id?: string;
    slot_type?: "repeats_weekly" | "custom";
    start_date?: string;
    end_date?: string;
    weekly_repeat_interval?: number;
}

interface DaySchedule {
    [key: string]: TimeSlot[];
}

interface APITimeSlot {
    volunteer_slot_id?: string;
    start_time: string;
    end_time: string;
    slot_type?: "repeats_weekly" | "custom";
    start_date?: string;
    end_date?: string;
    weekly_repeat_interval?: number;
    utc_start_time?: string;
    utc_end_time?: string;
}

interface APIScheduleFormat {
    day: string;
    slots: APITimeSlot[];
}

interface DeletedSlot {
    volunteer_slot_id: string;
    day: string;
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
    const [deletedSlots, setDeletedSlots] = useState<DeletedSlot[]>([]);
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});
    const [repeatFrequency, setRepeatFrequency] = useState<{ [key: string]: { [slotIndex: number]: string } }>({});
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: { [slotIndex: number]: boolean } }>({});
    const [customRecurrenceModalOpen, setCustomRecurrenceModalOpen] = useState(false);
    const [currentDayForCustom, setCurrentDayForCustom] = useState<string>("");
    const [currentSlotIndexForCustom, setCurrentSlotIndexForCustom] = useState<number>(-1);
    const [justSavedCustom, setJustSavedCustom] = useState(false);
    const [customRecurrenceData, setCustomRecurrenceData] = useState<{
        [key: string]: { [slotIndex: number]: { start_date: string; end_date: string | null; weekly_repeat_interval?: number } };
    }>({});
    const queryClient = useQueryClient();
    const { volunteerUtcOffset } = useAppStore();
    
    useEffect(() => {
        // Only fetch when modal is open
        if (!isOpen) return;

        // Reset state when modal opens to avoid stale data
        setDeletedSlots([]);
        setCustomRecurrenceData({});
        setRepeatFrequency({});
        
        GET_API(endpoints.volunteer_slot.get)
            .then((res: any) => {
                // Initialize all days with empty arrays
                const newSchedule: DaySchedule = {
                    Sunday: [],
                    Monday: [],
                    Tuesday: [],
                    Wednesday: [],
                    Thursday: [],
                    Friday: [],
                    Saturday: [],
                };

                // Handle response: res.data should be an array of day objects
                // Response format: [{ day: "Sunday", slots: [...], volunteer_id: "...", updated_at: "..." }, ...]
                const slotsData = Array.isArray(res?.data) ? res.data : [];
                
                if (slotsData.length === 0) {
                    setSchedule(newSchedule);
                    return;
                }
                
                // Initialize state objects to batch updates
                const newCustomRecurrenceData: {
                    [key: string]: { [slotIndex: number]: { start_date: string; end_date: string | null; weekly_repeat_interval?: number } };
                } = {};
                const newRepeatFrequency: { [key: string]: { [slotIndex: number]: string } } = {};

            // Populate the schedule with API data
                slotsData.forEach((dayData: any) => {
                    const dayName = dayData.day;
                    if (dayName && dayData.slots && Array.isArray(dayData.slots)) {
                        newSchedule[dayName] = dayData.slots.map((slot: any) => ({
                        volunteer_slot_id: slot.volunteer_slot_id,
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                            slot_type: slot.slot_type || "repeats_weekly",
                            start_date: slot.start_date,
                            end_date: slot.end_date,
                            weekly_repeat_interval: slot.weekly_repeat_interval,
                        }));
                        
                        // Store custom recurrence data if slot_type is custom
                        dayData.slots.forEach((slot: any, slotIndex: number) => {
                            if (slot.slot_type === "custom" && slot.start_date) {
                                // Initialize day object if it doesn't exist
                                if (!newCustomRecurrenceData[dayName]) {
                                    newCustomRecurrenceData[dayName] = {};
                                }
                                if (!newRepeatFrequency[dayName]) {
                                    newRepeatFrequency[dayName] = {};
                                }
                                
                                newCustomRecurrenceData[dayName][slotIndex] = {
                                    start_date: slot.start_date,
                                    end_date: slot.end_date || null,
                                    weekly_repeat_interval: slot.weekly_repeat_interval,
                                };
                                newRepeatFrequency[dayName][slotIndex] = "custom";
                            } else {
                                // Initialize day object if it doesn't exist
                                if (!newRepeatFrequency[dayName]) {
                                    newRepeatFrequency[dayName] = {};
                                }
                                newRepeatFrequency[dayName][slotIndex] = slot.slot_type === "repeats_weekly" ? "weekly" : "weekly";
                            }
                        });
                    }
                });

                // Batch all state updates together
                setSchedule(newSchedule);
                setCustomRecurrenceData(newCustomRecurrenceData);
                setRepeatFrequency(newRepeatFrequency);
            })
            .catch((error: any) => {
                showToast({ message: "Failed to load schedule", type: "error" });
            });
    }, [isOpen]);
   

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

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.repeat-dropdown-container')) {
                setOpenDropdowns({});
            }
        };

        const hasOpenDropdown = Object.values(openDropdowns).some((dayDropdowns) => 
            dayDropdowns && typeof dayDropdowns === 'object' && Object.values(dayDropdowns).some(Boolean)
        );

        if (hasOpenDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [openDropdowns]);

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
            [day]: [...prev[day], { start_time: "", end_time: "", slot_type: "repeats_weekly" }],
        }));
    };

    const removeTimeSlot = (day: string, slotIndex: number) => {
        setSchedule((prev) => {
            const slotToRemove = prev[day][slotIndex];
            if (slotToRemove.volunteer_slot_id) {
                setDeletedSlots((prev) => {
                    // Check if the ID already exists in the array to prevent duplicates
                    if (!prev.some((slot) => slot.volunteer_slot_id === slotToRemove.volunteer_slot_id)) {
                        return [...prev, { volunteer_slot_id: slotToRemove.volunteer_slot_id!, day }];
                    }
                    return prev;
                });
            }

            // Clean up custom recurrence data for this slot
            setCustomRecurrenceData((prev) => {
                const newData = { ...prev };
                if (newData[day]?.[slotIndex]) {
                    // Shift indices for slots after the removed one
                    const updatedDayData: { [slotIndex: number]: { start_date: string; end_date: string | null; weekly_repeat_interval?: number } } = {};
                    Object.keys(newData[day] || {}).forEach((key) => {
                        const idx = parseInt(key);
                        if (idx < slotIndex) {
                            updatedDayData[idx] = newData[day][idx];
                        } else if (idx > slotIndex) {
                            updatedDayData[idx - 1] = newData[day][idx];
                        }
                    });
                    if (Object.keys(updatedDayData).length === 0) {
                        delete newData[day];
                    } else {
                        newData[day] = updatedDayData;
                    }
                }
                return newData;
            });

            // Clean up repeat frequency data
            setRepeatFrequency((prev) => {
                const newFreq = { ...prev };
                if (newFreq[day]) {
                    const updatedDayFreq: { [slotIndex: number]: string } = {};
                    Object.keys(newFreq[day] || {}).forEach((key) => {
                        const idx = parseInt(key);
                        if (idx < slotIndex) {
                            updatedDayFreq[idx] = newFreq[day][idx];
                        } else if (idx > slotIndex) {
                            updatedDayFreq[idx - 1] = newFreq[day][idx];
                        }
                    });
                    if (Object.keys(updatedDayFreq).length === 0) {
                        delete newFreq[day];
                    } else {
                        newFreq[day] = updatedDayFreq;
                    }
                }
                return newFreq;
            });

            return {
                ...prev,
                [day]: prev[day].filter((_, index) => index !== slotIndex),
            };
        });
    };

    const formatScheduleForAPI = (): APIScheduleFormat[] => {
        return days.map((day) => ({
            day,
            slots: schedule[day]
                .filter((slot) => slot.start_time && slot.end_time) // Only include filled slots
                .map((slot, slotIndex) => {
                    const frequencyValue = repeatFrequency[day]?.[slotIndex];
                    const slotType: "repeats_weekly" | "custom" = 
                        slot.slot_type || 
                        (frequencyValue === "custom" ? "custom" : "repeats_weekly") ||
                        "repeats_weekly";
                    const isCustom = slotType === "custom";
                    const customData = customRecurrenceData[day]?.[slotIndex];
                    
                    const apiSlot: APITimeSlot = {
                        volunteer_slot_id: slot.volunteer_slot_id || generateTimeSlotId(slot.start_time, slot.end_time),
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                        slot_type: slotType,
                        utc_start_time: convertToUTC(volunteerUtcOffset, slot.start_time),
                        utc_end_time: convertToUTC(volunteerUtcOffset, slot.end_time),
                    };
                    
                    // Add start_date, end_date, and weekly_repeat_interval for custom recurrence
                    if (isCustom && customData) {
                        apiSlot.start_date = customData.start_date;
                        if (customData.end_date) {
                            apiSlot.end_date = customData.end_date;
                        }
                        if (customData.weekly_repeat_interval) {
                            apiSlot.weekly_repeat_interval = customData.weekly_repeat_interval;
                        }
                    }
                    
                    // Add weekly_repeat_interval for repeats_weekly slots (default to 1 if not specified)
                    if (slotType === "repeats_weekly") {
                        apiSlot.weekly_repeat_interval = slot.weekly_repeat_interval || 1;
                    }
                    
                    return apiSlot;
                }),
        }));
    };

    const handleSave = async () => {
        const formattedData = formatScheduleForAPI();
        const payload = {
            deleted_slots: deletedSlots,
            slots: formattedData,
        };
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
        error: () => {},
    });

    // Add this CSS class to style the TimePicker input
    const timePickerClass = cn("!text-sm");

    // Add this function to check if there are any errors
    const hasErrors = () => {
        return Object.values(errors).some((dayErrors) => dayErrors.length > 0);
    };

    const toggleDay = (day: string) => {
        setExpandedDays((prev) => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

    const toggleRepeatDropdown = (day: string, slotIndex: number) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [slotIndex]: !prev[day]?.[slotIndex],
            },
        }));
    };

    const handleRepeatFrequencyChange = (day: string, slotIndex: number, value: string) => {
        if (value === "custom") {
            // Immediately set repeatFrequency to "custom" so UI updates
            setRepeatFrequency((prev) => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [slotIndex]: "custom",
                },
            }));
            setCurrentDayForCustom(day);
            setCurrentSlotIndexForCustom(slotIndex);
            setCustomRecurrenceModalOpen(true);
        } else {
            setRepeatFrequency((prev) => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [slotIndex]: value,
                },
            }));
            // Update schedule slot_type when changing to weekly
            setSchedule((prev) => ({
                ...prev,
                [day]: prev[day].map((slot, index) =>
                    index === slotIndex
                        ? {
                              ...slot,
                              slot_type: "repeats_weekly",
                              start_date: undefined,
                              end_date: undefined,
                          }
                        : slot
                ),
            }));
            // Remove custom recurrence data if switching away from custom
            setCustomRecurrenceData((prev) => {
                const newData = { ...prev };
                if (newData[day]?.[slotIndex]) {
                    delete newData[day][slotIndex];
                    if (Object.keys(newData[day]).length === 0) {
                        delete newData[day];
                    }
                }
                return newData;
            });
        }
        setOpenDropdowns((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [slotIndex]: false,
            },
        }));
    };

    const handleCustomRecurrenceSave = (data: {
        repeatEvery: number;
        repeatUnit: string;
        startDate: dayjs.Dayjs | null;
        endType: "never" | "date";
        endDate: dayjs.Dayjs | null;
    }) => {
        if (!data.startDate) {
            showToast({ message: "Please select a start date", type: "error" });
            return;
        }
        
        const startDateStr = data.startDate.format("YYYY-MM-DD");
        const endDateStr = data.endType === "date" && data.endDate ? data.endDate.format("YYYY-MM-DD") : null;
        
        // Update all states immediately
        setSchedule((prev) => ({
            ...prev,
            [currentDayForCustom]: prev[currentDayForCustom].map((slot, index) => {
                if (index === currentSlotIndexForCustom) {
                    const updatedSlot: TimeSlot = {
                        ...slot,
                        slot_type: "custom" as const,
                        start_date: startDateStr,
                        end_date: data.endType === "date" && data.endDate ? endDateStr || undefined : undefined,
                    };
                    return updatedSlot;
                }
                return slot;
            }),
        }));
        
        setRepeatFrequency((prev) => ({
            ...prev,
            [currentDayForCustom]: {
                ...prev[currentDayForCustom],
                [currentSlotIndexForCustom]: "custom",
            },
        }));
        
        // Store the custom recurrence dates
        setCustomRecurrenceData((prev) => ({
            ...prev,
            [currentDayForCustom]: {
                ...prev[currentDayForCustom],
                [currentSlotIndexForCustom]: {
                    start_date: startDateStr,
                    end_date: endDateStr,
                    weekly_repeat_interval: data.repeatEvery,
                },
            },
        }));
        
        // Close the modal directly here to avoid race conditions with async state updates
        // Mark that we just saved so onClose won't revert the changes
        setJustSavedCustom(true);
        setCustomRecurrenceModalOpen(false);
        setCurrentDayForCustom("");
        setCurrentSlotIndexForCustom(-1);
        
        // Reset the flag after modal is fully closed
        setTimeout(() => {
            setJustSavedCustom(false);
        }, 100);
    };

    const repeatOptions = [
        { label: "Repeats Weekly", value: "weekly" },
        { label: "Custom", value: "custom" },
    ];

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
                    <div className="flex flex-col gap-4 p-5 pt-0">
                        {days.map((day) => {
                            const isExpanded = expandedDays[day];
                            return (
                                <div key={day} className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4">
                                    <div 
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleDay(day)}
                                    >
                                        <p className="font-semibold">{day}</p>
                                        <ChevronRightIcon className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </div>
                                    {isExpanded && (
                                        <div className="flex items-start justify-between gap-2 pt-2">
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
                                                            <div className="relative pt-2 repeat-dropdown-container">
                                                                <div
                                                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-gray-300 transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleRepeatDropdown(day, slotIndex);
                                                                    }}
                                                                >
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {(() => {
                                                                            const slot = schedule[day][slotIndex];
                                                                            const freq = repeatFrequency[day]?.[slotIndex];
                                                                            
                                                                            // Prioritize schedule slot_type if it's custom, otherwise use repeatFrequency
                                                                            if (slot?.slot_type === "custom") {
                                                                                return "Custom";
                                                                            } else if (freq) {
                                                                                return repeatOptions.find(opt => opt.value === freq)?.label || "Repeats Weekly";
                                                                            }
                                                                            return "Repeats Weekly";
                                                                        })()}
                                                                    </span>
                                                                    <svg
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={cn(
                                                                            "transition-transform duration-200",
                                                                            openDropdowns[day]?.[slotIndex] ? "rotate-90" : ""
                                                                        )}
                                                                    >
                                                                        <path
                                                                            d="M7.5 5L12.5 10L7.5 15"
                                                                            stroke="#121212"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                {openDropdowns[day]?.[slotIndex] && (
                                                                    <div 
                                                                        className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {repeatOptions.map((option) => (
                                                                            <div
                                                                                key={option.value}
                                                                                className={cn(
                                                                                    "flex items-center justify-between p-3 text-sm cursor-pointer transition-colors",
                                                                                    repeatFrequency[day]?.[slotIndex] === option.value || (!repeatFrequency[day]?.[slotIndex] && option.value === "weekly")
                                                                                        ? "bg-gray-50 text-gray-900 font-medium"
                                                                                        : "text-gray-700 hover:bg-gray-50"
                                                                                )}
                                                                                onClick={() => handleRepeatFrequencyChange(day, slotIndex, option.value)}
                                                                            >
                                                                                <span>{option.label}</span>
                                                                                {(repeatFrequency[day]?.[slotIndex] === option.value || (!repeatFrequency[day]?.[slotIndex] && option.value === "weekly")) && (
                                                                                    <CheckIcon />
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div> 
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-gray-500 font-medium border border-stroke-light text-center rounded-xl px-3 py-1.5 w-[267px]">
                                                        No Schedules
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addTimeSlot(day);
                                                }}
                                                className="text-blue-500 mt-1.5 hover:text-blue-700 w-fit"
                                            >
                                                <AddSlotIcon />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <CustomRecurrenceModal
                isOpen={customRecurrenceModalOpen}
                initialData={
                    currentDayForCustom && currentSlotIndexForCustom >= 0
                        ? (() => {
                              const customData = customRecurrenceData[currentDayForCustom]?.[currentSlotIndexForCustom];
                              const slotData = schedule[currentDayForCustom]?.[currentSlotIndexForCustom];
                              
                              // Prefer customRecurrenceData, fallback to slotData
                              if (customData) {
                                  return {
                                      start_date: customData.start_date,
                                      end_date: customData.end_date,
                                      repeatEvery: customData.weekly_repeat_interval || 0,
                                  };
                              } else if (slotData?.slot_type === "custom" && slotData.start_date) {
                                  return {
                                      start_date: slotData.start_date,
                                      end_date: slotData.end_date,
                                      repeatEvery: 2,
                                  };
                              }
                              return undefined;
                          })()
                        : undefined
                }
                onClose={() => {
                    // If user cancels without saving, revert to weekly if no custom data exists
                    // But skip this if we just saved (justSavedCustom flag)
                    const wasJustSaved = justSavedCustom;
                    const day = currentDayForCustom;
                    const slotIndex = currentSlotIndexForCustom;
                    
                    // Close modal first
                    setCustomRecurrenceModalOpen(false);
                    setCurrentDayForCustom("");
                    setCurrentSlotIndexForCustom(-1);
                    
                    // Only check and revert if we didn't just save
                    if (!wasJustSaved && day && slotIndex >= 0) {
                        // Use setTimeout to check after state has potentially updated
                        setTimeout(() => {
                            setSchedule((prev) => {
                                const slot = prev[day]?.[slotIndex];
                                const hasCustomData = slot?.slot_type === "custom" && slot?.start_date;
                                
                                if (!hasCustomData) {
                                    // Revert to weekly if no custom data was saved
                                    return {
                                        ...prev,
                                        [day]: prev[day].map((s, index) =>
                                            index === slotIndex
                                                ? {
                                                      ...s,
                                                      slot_type: "repeats_weekly",
                                                      start_date: undefined,
                                                      end_date: undefined,
                                                  }
                                                : s
                                        ),
                                    };
                                }
                                return prev;
                            });
                            
                            setRepeatFrequency((prev) => {
                                const freq = prev[day]?.[slotIndex];
                                // Only revert if it's not "custom"
                                if (freq !== "custom") {
                                    return {
                                        ...prev,
                                        [day]: {
                                            ...prev[day],
                                            [slotIndex]: "weekly",
                                        },
                                    };
                                }
                                return prev;
                            });
                        }, 0);
                    }
                    
                    // Reset the flag after a delay to ensure state updates are processed
                    if (wasJustSaved) {
                        setTimeout(() => {
                            setJustSavedCustom(false);
                        }, 100);
                    } else {
                        setJustSavedCustom(false);
                    }
                }}
                onSave={handleCustomRecurrenceSave}
            />
        </SideModal>
    );
};

export default MyScheduleModal;
