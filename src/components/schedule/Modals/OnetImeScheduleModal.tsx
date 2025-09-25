import SideModal from "@/components/common/Modals/SideModal";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/common/Input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import dayjs from "dayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TrashIcon from "@/assets/icons/TrashIcon";
import AddSlotIcon from "@/assets/icons/AddSlotIcon";
import { generateTimeSlotId } from "@/utils/timeFunctions";
import { showToast } from "@/components/common/Toast";
import { Spin } from "antd";

interface OnetImeScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    isMobileScreen: boolean;
    currentDate: string;
}

interface TimePickerComponentProps {
    value: string;
    onChange: (value: string) => void;
    disabledTimes?: string[];
}

const OnetImeScheduleModal = ({
    isOpen,
    onClose,
    isMobileScreen,
    currentDate,
}: OnetImeScheduleModalProps) => {
    const [isPending, setIsPending] = useState(false);
    const [slots, setSlots] = useState([{ start_time: "", end_time: "" }]);
    const [existingSlots, setExistingSlots] = useState<any[]>([]);
    const [invalidSlots, setInvalidSlots] = useState<number[]>([]);
    const queryClient = useQueryClient();
    const [isAvailableDaysLoading, setIsAvailableDaysLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const getAvailableDaysForDate = async () => {
        console.log(currentDate, "currentDate");
        if (currentDate !== "") {
            setIsAvailableDaysLoading(true);
            const response = await GET_API(
                endpoints.volunteer_slot.getAvailableDaysForDate(currentDate)
            );
            setExistingSlots(response.data.slots || []);
            setIsAvailableDaysLoading(false);
            if (slots.length === 0 && isOpen) {
                addSlot();
            }
            return response.data;
        }
    };
    const { data: availableDays, isLoading } = useQuery({
        queryKey: ["availableDays", currentDate],
        queryFn: () => getAvailableDaysForDate(),
    });

    useEffect(() => {
        if (availableDays && availableDays.slots) {
            setExistingSlots(availableDays.slots);
        }
    }, [availableDays]);

    useEffect(() => {
        if (slots.length === 0 && isOpen) {
            addSlot();
        }
    }, [isOpen]);

    console.log(availableDays, "availableDays for date");

    const handleSubmit = () => {
        // Filter out empty slots and check if there are any valid slots
        const validSlots = slots.filter((slot) => slot.start_time && slot.end_time);
        if (validSlots.length === 0) {
            showToast({
                message: "Please select at least one valid slot before saving.",
                type: "error",
            });
            return;
        }

        if (invalidSlots.length > 0) {
            showToast({
                message: "Please fix overlapping slots before submitting.",
                type: "error",
            });
            return;
        }
        validSlots.forEach((slot, idx) => {
            console.log(`Slot ${idx + 1}: Start - ${slot.start_time}, End - ${slot.end_time}`);
        });
        setIsSaving(true);
        const formattedData = validSlots.map((slot) => ({
            date: moment(currentDate).format("DD-MM-YYYY"),
            volunteer_slot_id: generateTimeSlotId(slot.start_time, slot.end_time),
            start_time: slot.start_time,
            end_time: slot.end_time,
        }));
        POST_API(endpoints.volunteer_slot.createSlotForParticularDate, formattedData)
            .then((res) => {
                console.log(res, "res");
                onClose();
                showToast({
                    message: "Slots created successfully",
                    type: "success",
                });
                setSlots([]);
                setExistingSlots([]);
                queryClient.invalidateQueries({
                    queryKey: ["volunteer-events"],
                });
            })
            .catch((err) => {
                console.log(err, "err");
                showToast({
                    message: "Error creating slots",
                    type: "error",
                });
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const addSlot = () => setSlots([...slots, { start_time: "", end_time: "" }]);
    const removeSlot = (index: number) => {
        setSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
        setInvalidSlots((prevInvalid) =>
            prevInvalid.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
        );
    };

    function areSlotsOverlapping(
        slotA: { start_time: string; end_time: string },
        slotB: { start_time: string; end_time: string }
    ) {
        if (!slotA.start_time || !slotA.end_time || !slotB.start_time || !slotB.end_time)
            return false;
        const startA = dayjs(slotA.start_time, "HH:mm");
        const endA = dayjs(slotA.end_time, "HH:mm");
        const startB = dayjs(slotB.start_time, "HH:mm");
        const endB = dayjs(slotB.end_time, "HH:mm");
        return startA.isBefore(endB) && endA.isAfter(startB);
    }

    const handleTimeChange = (
        index: number,
        type: "start_time" | "end_time",
        value: string | null
    ) => {
        const updatedSlots = [...slots];
        updatedSlots[index][type] = value || "";

        // Swap logic: if both times are set and start_time > end_time, swap them
        const start = updatedSlots[index].start_time;
        const end = updatedSlots[index].end_time;
        if (start && end && dayjs(start, "HH:mm").isAfter(dayjs(end, "HH:mm"))) {
            // Swap
            updatedSlots[index].start_time = end;
            updatedSlots[index].end_time = start;
        }

        let newInvalidSlots = [...invalidSlots];

        // Only validate if both start and end are set
        if (updatedSlots[index].start_time && updatedSlots[index].end_time) {
            // Check for exact match with existing slots
            const isExactMatch = existingSlots.some(
                (slot) =>
                    slot.start_time === updatedSlots[index].start_time &&
                    slot.end_time === updatedSlots[index].end_time
            );
            // Check for overlap with existing slots
            const isOverlap = existingSlots.some((slot) => {
                const slotStart = dayjs(slot.start_time, "HH:mm");
                const slotEnd = dayjs(slot.end_time, "HH:mm");
                const newStart = dayjs(updatedSlots[index].start_time, "HH:mm");
                const newEnd = dayjs(updatedSlots[index].end_time, "HH:mm");
                return newStart.isBefore(slotEnd) && newEnd.isAfter(slotStart);
            });
            // Check for duplicate in new slots
            const isDuplicate = updatedSlots.some(
                (slot, idx) =>
                    idx !== index &&
                    slot.start_time === updatedSlots[index].start_time &&
                    slot.end_time === updatedSlots[index].end_time
            );

            // Check for overlaps among new slots
            updatedSlots.forEach((slot, idx) => {
                if (idx !== index && areSlotsOverlapping(updatedSlots[index], slot)) {
                    if (!newInvalidSlots.includes(index)) newInvalidSlots.push(index);
                    if (!newInvalidSlots.includes(idx)) newInvalidSlots.push(idx);
                }
            });

            if (isExactMatch || isOverlap || isDuplicate) {
                if (!newInvalidSlots.includes(index)) newInvalidSlots.push(index);
            } else {
                newInvalidSlots = newInvalidSlots.filter((i) => i !== index);
            }
        } else {
            newInvalidSlots = newInvalidSlots.filter((i) => i !== index);
        }

        setInvalidSlots(newInvalidSlots);
        setSlots(updatedSlots);
    };

    const TimePickerComponent: React.FC<TimePickerComponentProps & { error?: boolean }> = ({
        value,
        onChange,
        error,
        disabledTimes = [],
    }) => {
        const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(
            value ? dayjs(value, "HH:mm") : null
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
                            onChange(tempTime.format("HH:mm"));
                        }
                    }}
                    closeOnSelect={false}
                    shouldDisableTime={(timeValue, clockType) => {
                        if (clockType === "hours" || clockType === "minutes") {
                            const hour =
                                clockType === "hours" ? timeValue : tempTime ? tempTime.hour() : 0;
                            const minute =
                                clockType === "minutes"
                                    ? timeValue
                                    : tempTime
                                    ? tempTime.minute()
                                    : 0;
                            // @ts-ignore
                            const timeStr = dayjs().hour(hour).minute(minute).format("HH:mm");
                            return disabledTimes.includes(timeStr);
                        }
                        return false;
                    }}
                    slotProps={{
                        textField: {
                            sx: error ? { border: "2px solid #ef4444", borderRadius: "12px" } : {},
                        },
                    }}
                />
            </LocalizationProvider>
        );
    };

    // Collect all start and end times from existingSlots
    const disabledTimes = [
        ...existingSlots.map((slot) => slot.start_time),
        ...existingSlots.map((slot) => slot.end_time),
    ];

    const handleClose = () => {
        setSlots([]);
        setInvalidSlots([]);
        onClose();
    };

    return (
        <SideModal
            title={`${moment(currentDate).format("DD MMMM YYYY")}`}
            onClose={handleClose}
            isOpen={isOpen}
            onSave={handleSubmit}
            isLoading={isPending || isSaving}
            onCancel={handleClose}
            modalWidth={isMobileScreen ? 600 : 400}
        >
            {isAvailableDaysLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Spin />
                </div>
            ) : (
                <div className="flex flex-col max-lg:gap-3 px-5 mt-7">
                    <Input
                        name="selected_date"
                        onChange={() => {}}
                        key={"selected_date"}
                        label="Select Date"
                        labelClassName="!text-[1rem] !font-medium"
                        inputType="datepicker"
                        placeholder="Select a date"
                        value={new Date(currentDate)}
                        required={true}
                        disabled={true}
                        error={""}
                    />

                    <div className="border-b border-gray-200 pb-6">
                        <p className="font-medium mt-4">Existing Slots</p>
                        {existingSlots.length === 0 && (
                            <p className="text-gray-500 mt-1">No slots for this date.</p>
                        )}
                        {existingSlots.map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-2 mt-2 w-full">
                                <div className="bg-gray-200 rounded-xl px-4 py-2 w-full text-center font-medium text-sm">
                                    {dayjs(slot.start_time, "HH:mm").format("h:mm A")}
                                </div>
                                <span>to</span>
                                <div className="bg-gray-200 rounded-xl px-4 py-2 w-full text-center font-medium text-sm">
                                    {dayjs(slot.end_time, "HH:mm").format("h:mm A")}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="font-medium mt-4">Create New Slots</p>
                        {slots.map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-2 mt-2">
                                <TimePickerComponent
                                    value={slot.start_time}
                                    onChange={(val) => handleTimeChange(idx, "start_time", val)}
                                    error={invalidSlots.includes(idx)}
                                    disabledTimes={disabledTimes}
                                />
                                <span>to</span>
                                <TimePickerComponent
                                    value={slot.end_time}
                                    onChange={(val) => handleTimeChange(idx, "end_time", val)}
                                    error={invalidSlots.includes(idx)}
                                    disabledTimes={disabledTimes}
                                />
                                <button
                                    onClick={addSlot}
                                    className="mt- text-blue-500 flex items-center"
                                >
                                    {idx === slots.length - 1 && <AddSlotIcon />}
                                </button>
                                {slots.length > 1 && (
                                    <span
                                        onClick={() => removeSlot(idx)}
                                        className="cursor-pointer text-red-500"
                                    >
                                        <TrashIcon />
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </SideModal>
    );
};

export default OnetImeScheduleModal;
