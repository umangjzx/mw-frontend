import { Radio, Skeleton } from "antd";
import { useState, useEffect } from "react";

const AvailableSlotsRadioGroup: React.FC<AvailableSlotsRadioGroupProps> = ({
    availableSlots,
    selectedSlot,
    onSlotSelect,
    errors,
    slotError,
    fetchingSlots,
}) => {
    const [isSlotsAvailable, setIsSlotsAvailable] = useState(false);

    console.log(fetchingSlots, "fetchingSlots");

    useEffect(() => {
        setIsSlotsAvailable(availableSlots.length > 0);
    }, [availableSlots]);

    if (!isSlotsAvailable) {
        return (
            <div>
                {slotError ? (
                    <p className="text-xs font-normal -mt-2 mb-2 text-red-500">{slotError}</p>
                ) : (
                    <p className="text-xs font-normal mb-2 text-gray-400">
                        {fetchingSlots ? (
                            <span>Fetching slots...</span>
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
            {isSlotsAvailable && <p className="text-xs text-red-500 mt-1">{errors}</p>}
        </div>
    );
};

export default AvailableSlotsRadioGroup;
