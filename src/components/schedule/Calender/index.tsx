import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    DateSelectArg,
    EventClickArg,
    EventApi,
    EventRemoveArg,
    formatDate,
} from "@fullcalendar/core";
import { useState } from "react";
import "./styles.css";
import EventCard from "./EventCard";
import DayCellContent from "./DayCellContent";
import { AlertModal, AllEventsModal } from "../Modals";
import { getTime } from "@/utils/calender";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
    const [showModal, setShowModal] = useState<ModalType>(null);
    const [currentEventData, setCurrentEventData] = useState<{ events: EventApi[]; date: string }>({
        events: [],
        date: "",
    });

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
                classNames: ["event-item", "rounded-md", "px-3", "py-1", "my-0.5"],
                textColor: "var(--success-color)",
                borderColor: "var(--success-color)",
            });
        }
    };

    const handleEventRemove = (removeInfo: EventRemoveArg) => {
        alert("Are you sure you want to delete this event?");
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        setShowModal(null);
    };

    const handleCloseModal = () => {
        setShowModal(null);
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <EventCard
                style={eventInfo.event._def.ui}
                title={eventInfo.event.title}
                time={getTime(eventInfo.event.start)}
            />
        );
    };

    const customDayHeaderContent = (args: any) => {
        const dayIcons: { [key: string]: string } = {
            Mon: "🧟",
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

    return (
        <>
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
                onEventClick={event => {
                    handleEventClick({ event } as EventClickArg);
                }}
            />
            <div className='p-4'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
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
                    initialEvents={[
                        {
                            title: "Event Name",
                            date: "2024-12-15",
                            backgroundColor: "#4ade80",
                            classNames: ["event-item", "rounded-md", "px-1", "py-1",],
                        },
                        {
                            title: "Event Name",
                            date: "2024-12-15",
                            backgroundColor: "#ef4444",
                            classNames: ["event-item", "rounded-md", "px-1", "py-1", ],
                        },
                    ]}
                    moreLinkClassNames={["!text-primary", "hover:!bg-transparent"]}
                    moreLinkClick={handleMoreLinkClick}
                />
            </div>
        </>
    );
};

export default Calendar;
