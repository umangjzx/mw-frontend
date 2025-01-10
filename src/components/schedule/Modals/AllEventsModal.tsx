import CenterModal from "@/components/common/Modals/CenterModal";
import EventCard from "../Calender/EventCard";

const AllEventsModal = ({ isOpen, onClose, data, onEventClick }: AllEventsModalProps) => {
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
                {data.events.map((event, index) => {
                    return (
                        <EventCard
                            key={event?._def?.id || index}
                            title={event?._def?.title}
                            style={event?._def?.ui}
                            status={event?._def?.extendedProps?.status}
                            time=""
                            start={event?.start}
                            end={event?.end}
                            className="!p-2 rounded-md border !cursor-pointer"
                            onEventClick={(e) => onEventClick(e?.currentTarget, event)}
                        />
                    );
                })}
            </div>
        </CenterModal>
    );
};

export default AllEventsModal;
