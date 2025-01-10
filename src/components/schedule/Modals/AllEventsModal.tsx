import CenterModal from "@/components/common/Modals/CenterModal";
import EventCard from "../Calender/EventCard";

const AllEventsModal = ({ isOpen, onClose, onSave, data, onEventClick }: AllEventsModalProps) => {
    console.log("🚀 ~ AllEventsModal ~ data:", data.events);

    const handleClick = (e: any) => {
        console.log(e)
        onEventClick(e);
    }
    return (
        <CenterModal
            title={`Schedule - ${data.date}`}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            customClassName="!rounded-3xl !h-[70vh]"
            hideFooter={true}
        >
            <div className="flex flex-col gap-2">
                {data.events.map((event) => {
                    return (
                        <EventCard
                            key={event.id}
                            title={event.title}
                            style={event.ui}
                            status={event?.extendedProps?.status}
                            time={event.time}
                            className="!p-2 rounded-md border"
                            onEventClick={handleClick}
                        />
                    );
                })}
            </div>
        </CenterModal>
    );
};

export default AllEventsModal;
