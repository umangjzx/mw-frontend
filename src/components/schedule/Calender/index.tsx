"use client";
import { useAppStore } from "@/store/useAppStore";
import { EventApi, EventClickArg, formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MeetingPreviewModal from "../MeetingPreviewModal";
import { AlertModal, AllEventsModal } from "../Modals";
import DayCellContent from "./DayCellContent";
import EventCard from "./EventCard";
import "./styles.css";

interface CalendarProps {
    events: any;
    onDateSelect?: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onDateSelect }) => {
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
    const [showPreview, setShowPreview] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
    const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<EventApi | null>(null);
    const calendarRef = useRef<any>(null);
    const searchParams = useSearchParams();
    const currentDate = searchParams.get("current_month");
    const modalParam = searchParams.get("modal");
    const { setEventDetails } = useAppStore();

    useEffect(() => {
        if (modalParam === "feedback") {
            setShowPreview(false);
        }
    }, [modalParam]);

    const handleEventClick = (clickInfo: EventClickArg) => {
        const rect = clickInfo?.el?.getBoundingClientRect();

        // Calculate position relative to viewport
        let xPosition = rect.left;
        let yPosition = rect.bottom + 10;

        // Adjust for viewport edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // const modalWidth = 450;
        // const modalHeight = 400;
        const modalWidth = 405;
        const modalHeight = 315;
        if (xPosition + modalWidth > viewportWidth) {
            xPosition = viewportWidth - modalWidth - 10;
        }

        if (yPosition + modalHeight > viewportHeight) {
            yPosition = rect.top - modalHeight - 10;
        }

        setPreviewPosition({ x: xPosition, y: yPosition });
        setSelectedEvent(clickInfo.event);
        setSelectedEventForFeedback(clickInfo.event);
        setShowPreview(true);

        clickInfo.jsEvent.preventDefault();
        clickInfo.jsEvent.stopPropagation();
    };

    const handleModalEventClick = (buttonElement: HTMLButtonElement, data: any) => {
        const rect = buttonElement.getBoundingClientRect();

        // Calculate position relative to viewport
        let xPosition = rect.left;
        let yPosition = rect.bottom + 10;

        // Adjust for viewport edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = 405;
        const modalHeight = 315;

        if (xPosition + modalWidth > viewportWidth) {
            xPosition = viewportWidth - modalWidth - 10;
        }

        if (yPosition + modalHeight > viewportHeight) {
            yPosition = rect.top - modalHeight - 10;
        }

        setPreviewPosition({ x: xPosition, y: yPosition });
        setSelectedEvent(data);
        setSelectedEventForFeedback(data);
        setShowPreview(true);
    };

    const handleCloseModal = () => {
        setShowModal(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("modal");
        window.history.replaceState({}, "", url);
    };

    const renderEventContent = (eventInfo: any) => {
        const startMoment = moment(eventInfo.event.start);
        const endMoment = moment(eventInfo.event.end);
        let startTime, endTime;

        if (startMoment.isValid() && endMoment.isValid()) {
            startTime = startMoment.format("h:mm A");
            endTime = endMoment.format("h:mm A");
        } else {
            // Fallback for invalid dates
            startTime = "Invalid";
            endTime = "Time";
        }
        return (
            <EventCard
                title={eventInfo.event.title}
                time={`${startTime} - ${endTime}`}
                status={eventInfo.event._def.extendedProps.status}
            />
        );
    };

    const customDayHeaderContent = (args: any) => {
        const dayIcons: { [key: string]: string } = {
            Mon: "⛷️",
            Tue: "☕",
            Wed: "🐪",
            Thu: "🧠",
            Fri: "🍸",
            Sat: "🎉",
            Sun: "💆🏻‍♀️",
        };
        return <DayCellContent day={args.text} icon="" />;
    };

    const dayCellClassNames = "min-h-[100px] bg-white hover:bg-gray-50";

    const handleMoreLinkClick = (arg: any) => {
        arg.jsEvent.preventDefault();

        const dateEvents = arg.allSegs.map((seg: any) => seg?.event);
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
        if (typeof window === "undefined") return; // SSR safety check

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

    useEffect(() => {
        if (currentDate && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(moment(currentDate).format("YYYY-MM-DD"));
        }
    }, [currentDate]);

    useEffect(() => {
        setEventDetails(selectedEventForFeedback);
    }, [selectedEventForFeedback]);

    const handleEventMouseEnter = (mouseEnterInfo: any) => {
        const rect = mouseEnterInfo.el.getBoundingClientRect();

        // Calculate position relative to viewport
        let xPosition = rect.left;
        let yPosition = rect.bottom + 10;

        // Adjust for viewport edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = 405;
        const modalHeight = 315;

        if (xPosition + modalWidth > viewportWidth) {
            xPosition = viewportWidth - modalWidth - 10;
        }

        if (yPosition + modalHeight > viewportHeight) {
            yPosition = rect.top - modalHeight - 10;
        }

        setPreviewPosition({ x: xPosition, y: yPosition });
        setSelectedEvent(mouseEnterInfo.event);
        setSelectedEventForFeedback(mouseEnterInfo.event);
        setShowPreview(true);
    };

    const handleEventMouseLeave = () => {
        setShowPreview(false);
    };

    const handleDateClick = (arg: any) => {
        const clickedDate = moment(arg.dateStr);
        const currentDate = moment().startOf("day");

        if (clickedDate.isSameOrAfter(currentDate)) {
            if (onDateSelect) {
                onDateSelect(arg.dateStr);
            }
        }
    };

    // Preprocess events: fix midnight-crossing (end before start on same day)
    const processedEvents =
        events?.map((event: any) => {
            if (event.start && event.end) {
                const startMoment = moment(event.start);
                const endMoment = moment(event.end);
                if (
                    startMoment.isValid() &&
                    endMoment.isValid() &&
                    endMoment.isBefore(startMoment)
                ) {
                    return {
                        ...event,
                        end: endMoment.clone().add(1, "day").toISOString(),
                    };
                }
            }
            return event;
        }) || [];

    return (
        <>
            <MeetingPreviewModal
                isOpen={showPreview}
                data={events}
                onClose={() => {
                    setShowPreview(false);
                    setShowModal(null);
                }}
                event={selectedEvent}
                style={{
                    position: "fixed",
                    left: `${previewPosition.x}px`,
                    top: `${previewPosition.y}px`,
                    zIndex: 1000,
                }}
                onMouseLeave={handleEventMouseLeave}
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
                onEventClick={(element: HTMLButtonElement, data: any) => {
                    handleModalEventClick(element, data);
                }}
            />
            <div className="p-4 calendar-container">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    editable={false}
                    selectable={true}
                    selectMirror={false}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    dayMaxEvents={true}
                    weekends={true}
                    headerToolbar={false}
                    dayHeaderContent={customDayHeaderContent}
                    eventContent={(eventInfo) => renderEventContent(eventInfo)}
                    dayCellClassNames={dayCellClassNames}
                    events={processedEvents}
                    moreLinkClassNames={["!text-primary", "hover:!bg-transparent"]}
                    moreLinkClick={handleMoreLinkClick}
                />
            </div>
        </>
    );
};

export default Calendar;
