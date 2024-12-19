interface AvailableSlotsRadioGroupProps {
    availableSlots: Slot[];
    selectedSlot: string;
    onSlotSelect: (slotId: string, startTime: string, endTime: string) => void;
    errors: string;
    slotError: string;
    fetchingSlots: boolean;
}

interface Slot {
    volunteer_slot_id: string;
    start_time: string;
    end_time: string;
}
