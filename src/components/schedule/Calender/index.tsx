import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { TestmonialModal } from "@/components/volunteer/Modals";
import { useState } from "react";
import './styles.css';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                backgroundColor: '#4ade80',
                classNames: ['event-item', 'rounded-md', 'px-3', 'py-1', 'my-0.5']
            });
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        setIsOpen(true);
    };

    const renderEventContent = (eventInfo: any) => {
        const time = eventInfo.event.start ?
            new Date(eventInfo.event.start).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }) : '';

        return (
            <div className="flex items-center p-1 px-2 border-none  justify-between w-full text-sm text-white">
                <span className="font-medium">{eventInfo.event.title}</span>
                <span className="text-xs">{time}</span>
            </div>
        );
    };

    const customDayHeaderContent = (args: any) => {
        const dayIcons: { [key: string]: string } = {
            'Mon': '👤',
            'Tue': 'R',
            'Wed': '🦊',
            'Thu': '🌸',
            'Fri': '✈️',
            'Sat': '⭐',
            'Sun': '👑'
        };
        return (
            <div className="flex gap-2 items-center space-y-1 py-2">
                <div className="text-xl">{dayIcons[args.text]}</div>
                <div className="text-sm text-gray-600">{args.text}</div>
            </div>
        );
    };

    const dayCellClassNames = "min-h-[100px] bg-white hover:bg-gray-50";

    return (
        <>
            <TestmonialModal isOpen={isOpen} mode='create' />
            <div className="p-4">
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
                    headerToolbar={{
                        left: 'prev',
                        center: 'title',
                        right: 'next'
                    }}
                    dayHeaderContent={customDayHeaderContent}
                    eventContent={renderEventContent}
                    dayCellClassNames={dayCellClassNames}
                    initialEvents={[
                        {
                            title: "Event Name",
                            date: "2024-03-15",
                            backgroundColor: '#4ade80',
                            classNames: ['event-item', 'rounded-md', 'px-3', 'py-1', 'my-0.5']
                        },
                        {
                            title: "Event Name",
                            date: "2024-03-15",
                            backgroundColor: '#ef4444',
                            classNames: ['event-item', 'rounded-md', 'px-3', 'py-1', 'my-0.5']
                        }
                    ]}
                />
            </div>
        </>
    );
};

export default Calendar;
