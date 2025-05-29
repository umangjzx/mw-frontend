import SideModal from "@/components/common/Modals/SideModal";
import moment from "moment";
import React, { useState } from "react";
import { Input } from "@/components/common/Input";
import { useQuery } from "@tanstack/react-query";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import dayjs from "dayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TrashIcon from "@/assets/icons/TrashIcon";
import AddSlotIcon from "@/assets/icons/AddSlotIcon";
import { generateTimeSlotId } from "@/utils/timeFunctions";
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

    const getAvailableDaysForDate = async () => {
        console.log(currentDate, "currentDate");
        if (currentDate !== "") {
            const response = await GET_API(
                endpoints.volunteer_slot.getAvailableDaysForDate(currentDate)
            );
            return response.data;
        }
    };
    const { data: availableDays } = useQuery({
        queryKey: ["availableDays", currentDate],
        queryFn: () => getAvailableDaysForDate(),
        enabled: !!currentDate && currentDate !== "",
    });

    console.log(availableDays, "availableDays for date");

    const handleSubmit = () => {
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
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const addSlot = () => setSlots([...slots, { start_time: "", end_time: "" }]);
    const removeSlot = (index: number) => setSlots(slots.filter((_, i) => i !== index));
    const handleTimeChange = (
        index: number,
        type: "start_time" | "end_time",
        value: string | null
    ) => {
        const updatedSlots = [...slots];
        updatedSlots[index][type] = value || "";
        setSlots(updatedSlots);
    };

    const TimePickerComponent: React.FC<TimePickerComponentProps> = ({ value, onChange }) => {
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
                    inputType="datepicker"
                    placeholder="Select a date"
                    value={new Date(currentDate)}
                    required={true}
                    disabled={true}
                    error={""}
                />
                <div>
                    <p className="font-medium mt-4">Existing Slots</p>
                    {slots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2 mt-2">
                            <TimePickerComponent
                                value={slot.start_time}
                                onChange={(val) => handleTimeChange(idx, "start_time", val)}
                            />
                            <span>to</span>
                            <TimePickerComponent
                                value={slot.end_time}
                                onChange={(val) => handleTimeChange(idx, "end_time", val)}
                            />
                            <span
                                onClick={() => removeSlot(idx)}
                                className="cursor-pointer text-red-500"
                            >
                                <TrashIcon />
                            </span>
                        </div>
                    ))}
                    <button onClick={addSlot} className="mt-2 text-blue-500 flex items-center">
                        <AddSlotIcon /> <span className="ml-1">Add Slot</span>
                    </button>
                </div>
            </div>
        </SideModal>
    );
};

export default OnetImeScheduleModal;
