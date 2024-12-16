interface AvailableSlotsRadioGroupProps {
    availableSlots: Slot[];
    selectedSlot: string;
    onSlotSelect: (slotId: string, startTime: string, endTime: string) => void;
}

interface Slot {
    volunteer_slot_id: string;
    start_time: string;
    end_time: string;
}
