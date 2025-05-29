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

interface OnetImeScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    isMobileScreen: boolean;
    currentDate: string;
}

interface TimePickerComponentProps {
    value: string;
    onChange: (value: string) => void;
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

    const getAvailableDaysForDate = async () => {
        console.log(currentDate, "currentDate");
        if (currentDate !== "") {
            const response = await GET_API(
                endpoints.volunteer_slot.getAvailableDaysForDate(currentDate)
            );
            setExistingSlots(response.data.slots || []);
            return response.data;
        }
    };
    const { data: availableDays } = useQuery({
        queryKey: ["availableDays", currentDate],
        queryFn: () => getAvailableDaysForDate(),
        enabled: !!currentDate && currentDate !== "",
    });

    useEffect(() => {
        if (availableDays && availableDays.slots) {
            setExistingSlots(availableDays.slots);
        }
    }, [availableDays]);

    console.log(availableDays, "availableDays for date");

    const handleSubmit = () => {
        if (invalidSlots.length > 0) {
            showToast({
                message: "Please fix overlapping slots before submitting.",
                type: "error",
            });
            return;
        }
        slots.forEach((slot, idx) => {
            console.log(`Slot ${idx + 1}: Start - ${slot.start_time}, End - ${slot.end_time}`);
        });
        const formattedData = slots.map((slot) => ({
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
            });
    };

    const addSlot = () => setSlots([...slots, { start_time: "", end_time: "" }]);
    const removeSlot = (index: number) => setSlots(slots.filter((_, i) => i !== index));

    function isOverlapping(newStart: string, newEnd: string, slots: any[]) {
        if (!newStart || !newEnd) return false;
        const newStartTime = dayjs(newStart, "HH:mm");
        const newEndTime = dayjs(newEnd, "HH:mm");
        return slots.some((slot) => {
            const slotStart = dayjs(slot.start_time, "HH:mm");
            const slotEnd = dayjs(slot.end_time, "HH:mm");
            return newStartTime.isBefore(slotEnd) && newEndTime.isAfter(slotStart);
        });
    }

    const handleTimeChange = (
        index: number,
        type: "start_time" | "end_time",
        value: string | null
    ) => {
        const updatedSlots = [...slots];
        updatedSlots[index][type] = value || "";
        let newInvalidSlots = [...invalidSlots];

        // Check for overlap with existing slots
        if (updatedSlots[index].start_time && updatedSlots[index].end_time) {
            if (
                isOverlapping(
                    updatedSlots[index].start_time,
                    updatedSlots[index].end_time,
                    existingSlots
                )
            ) {
                if (!newInvalidSlots.includes(index)) newInvalidSlots.push(index);
            } else {
                newInvalidSlots = newInvalidSlots.filter((i) => i !== index);
            }
        } else {
            newInvalidSlots = newInvalidSlots.filter((i) => i !== index);
        }

        // Check for duplicate slots in the new slots array
        const isDuplicate = updatedSlots.some(
            (slot, idx) =>
                idx !== index &&
                slot.start_time === updatedSlots[index].start_time &&
                slot.end_time === updatedSlots[index].end_time &&
                slot.start_time !== "" &&
                slot.end_time !== ""
        );
        if (isDuplicate) {
            if (!newInvalidSlots.includes(index)) newInvalidSlots.push(index);
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
                    slotProps={{
                        textField: {
                            sx: error ? { border: "2px solid #ef4444", borderRadius: "12px" } : {},
                        },
                    }}
                />
            </LocalizationProvider>
        );
    };

    return (
        <SideModal
            title={`${moment(currentDate).format("DD MMMM YYYY")}`}
            onClose={onClose}
            isOpen={isOpen}
            onSave={handleSubmit}
            isLoading={isPending}
            onCancel={onClose}
            modalWidth={isMobileScreen ? 600 : 400}
        >
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
                            />
                            <span>to</span>
                            <TimePickerComponent
                                value={slot.end_time}
                                onChange={(val) => handleTimeChange(idx, "end_time", val)}
                                error={invalidSlots.includes(idx)}
                            />
                            <button
                                onClick={addSlot}
                                className="mt- text-blue-500 flex items-center"
                            >
                                {idx === slots.length - 1 && <AddSlotIcon />}
                            </button>
                            <span
                                onClick={() => removeSlot(idx)}
                                className="cursor-pointer text-red-500"
                            >
                                <TrashIcon />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SideModal>
    );
};

export default OnetImeScheduleModal;
