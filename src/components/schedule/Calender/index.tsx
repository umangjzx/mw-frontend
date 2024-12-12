import { getTime } from "@/utils/calender";
import {
    DateSelectArg,
    EventApi,
    EventClickArg,
    EventRemoveArg,
    formatDate,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { useEffect, useState } from "react";
import MeetingPreviewModal from "../MeetingPreviewModal";
import { AlertModal, AllEventsModal } from "../Modals";
import DayCellContent from "./DayCellContent";
import EventCard from "./EventCard";
import "./styles.css";

interface CalendarProps {
    events: any;
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
    console.log("🚀 ~ Calendar ~ events:", events);
    const [previewMeetingData, setPreviewMeetingData] = useState<any>(events);
    const [showModal, setShowModal] = useState<ModalType>(null);
    const [currentEventData, setCurrentEventData] = useState<{
        events: EventApi[];
        date: string;
        w?: any;
    }>({
        events: [],
        date: "",
    });
    const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
    const [showPreview, setShowPreview] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                backgroundColor: "var(--success-light-color)",
                classNames: ["event-item", "rounded-md", "capitalize", "px-3", "py-1", "my-0.5"],
                textColor: "var(--success-color)",
                borderColor: "var(--success-color)",
            });
        }
    };

    const handleEventRemove = (removeInfo: EventRemoveArg) => {
        alert("Are you sure you want to delete this event?");
    };

    //TODO: Fix the preview modal position
    const handleEventClick = (clickInfo: EventClickArg) => {
        const rect = clickInfo.el.getBoundingClientRect();

        // Calculate position relative to viewport
        let xPosition = rect.left;
        let yPosition = rect.bottom + 10;

        // Adjust for viewport edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = 450;
        const modalHeight = 400;

        if (xPosition + modalWidth > viewportWidth) {
            xPosition = viewportWidth - modalWidth - 10;
        }

        if (yPosition + modalHeight > viewportHeight) {
            yPosition = rect.top - modalHeight - 10;
        }

        setPreviewPosition({ x: xPosition, y: yPosition });
        setSelectedEvent(clickInfo.event);
        setShowPreview(true);

        clickInfo.jsEvent.preventDefault();
        clickInfo.jsEvent.stopPropagation();
    };

    const handleCloseModal = () => {
        setShowModal(null);
    };

    const renderEventContent = (eventInfo: any) => {
        const startTime = moment(eventInfo.event.start).format("h:mm A");
        const endTime = moment(eventInfo.event.end).format("h:mm A");

        return (
            <EventCard
                style={eventInfo.event._def.ui}
                title={eventInfo.event.title}
                time={`${startTime} - ${endTime}`}
            />
        );
    };

    const customDayHeaderContent = (args: any) => {
        const dayIcons: { [key: string]: string } = {
            Mon: "����",
            Tue: "☕",
            Wed: "🐪",
            Thu: "🧠",
            Fri: "🍸",
            Sat: "🎉",
            Sun: "💆🏻‍♀️",
        };
        return <DayCellContent day={args.text} icon={dayIcons[args.text]} />;
    };

    const dayCellClassNames = "min-h-[100px] bg-white hover:bg-gray-50";

    const handleMoreLinkClick = (arg: any) => {
        arg.jsEvent.preventDefault();

        console.log("🚀 ~ handleMoreLinkClick ~ arg:", arg);

        const dateEvents = arg.allSegs.map((seg: any) => ({
            ...seg.event._def,
            time: getTime(seg.event._instance.range.start),
        }));

        setCurrentEventData({
            events: dateEvents,
            date: formatDate(arg.date, {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        });
        setShowModal("events");
    };

    // Add a click handler to close the preview when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showPreview) {
                const modal = document.querySelector(".meeting-preview-modal");
                if (modal && !modal.contains(event.target as Node)) {
                    setShowPreview(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPreview]);

    return (
        <>
            <MeetingPreviewModal
                isOpen={showPreview}
                data={events}
                onClose={() => setShowPreview(false)}
                event={selectedEvent}
                style={{
                    position: "fixed",
                    left: `${previewPosition.x}px`,
                    top: `${previewPosition.y}px`,
                    zIndex: 1000,
                }}
            />
            <AlertModal
                isOpen={showModal === "alert"}
                onCancel={handleCloseModal}
                onProceed={() => setShowModal(null)}
                value={""}
                onChange={() => {}}
                onClose={handleCloseModal}
            />

            <AllEventsModal
                isOpen={showModal === "events"}
                onClose={handleCloseModal}
                onSave={() => setShowModal(null)}
                data={currentEventData}
                onEventClick={(event) => {
                    handleEventClick({ event } as EventClickArg);
                }}
            />
            <div className="p-4 calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventRemove={handleEventRemove}
                    headerToolbar={false}
                    dayHeaderContent={customDayHeaderContent}
                    eventContent={renderEventContent}
                    dayCellClassNames={dayCellClassNames}
                    events={events || []}
                    moreLinkClassNames={["!text-primary", "hover:!bg-transparent"]}
                    moreLinkClick={handleMoreLinkClick}
                />
            </div>
        </>
    );
};

export default Calendar;
