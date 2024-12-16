import { Radio } from "antd";

const AvailableSlotsRadioGroup: React.FC<AvailableSlotsRadioGroupProps> = ({
    availableSlots,
    selectedSlot,
    onSlotSelect,
}) => {
    if (availableSlots.length === 0) {
        return (
            <p className="text-xs font-normal mb-2 text-gray-400">
                To see available slots, select a volunteer and date.
            </p>
        );
    }

    return (
        <div className="mt-4">
            <p className="text-sm font-medium mb-2">Available Slots:</p>
            <Radio.Group
                size="small"
                onChange={(e) => {
                    const selectedSlot = availableSlots.find(
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
                    {availableSlots.map((slot) => (
                        <Radio
                            key={slot.volunteer_slot_id}
                            value={slot.volunteer_slot_id}
                            className="text-sm !text-[#16A34A] font-medium underline whitespace-nowrap"
                        >
                            {`${slot.start_time} - ${slot.end_time}`}
                        </Radio>
                    ))}
                </div>
            </Radio.Group>
        </div>
    );
};

export default AvailableSlotsRadioGroup;
