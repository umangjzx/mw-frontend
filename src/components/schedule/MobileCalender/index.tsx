"use client";

import { useAppStore } from "@/store/useAppStore";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertModal } from "../Modals";
import EventCard from "../Calender/EventCard";
import MobileMeetingPreviewModal from "./MeetingPreview";

interface CalendarProps {
    events: any;
}

const MobileCalender: React.FC<CalendarProps> = ({ events = [] }) => {
    const calendarRef = useRef<any>(null);
    const searchParams = useSearchParams();
    const currentDate = searchParams.get("current_month");
    const modalParam = searchParams.get("modal");
    const { setEventDetails } = useAppStore();
    
    const groupedEvents = useMemo(() => 
        Object.values(events?.reduce((acc: Record<string, any[]>, item: any) => {
            (acc[item.date] ||= []).push(item);
            return acc;
        }, {})).sort((a: any, b: any) => 
            new Date(a[0].date).getTime() - new Date(b[0].date).getTime()
        ), 
    [events]);

    const [showModal, setShowModal] = useState<ModalType>(null);
    const [showPreview, setShowPreview] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const renderEventContent = (eventInfo: any) => {
        const startTime = moment(eventInfo?.start).format("h:mm A");
        const endTime = moment(eventInfo?.end).format("h:mm A");
        return (
            <EventCard
                title={eventInfo?.title}
                time={`${startTime} - ${endTime}`}
                status={eventInfo?.status}
            />
        );
    };

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setEventDetails(event);
        setShowPreview(true);
    };

    useEffect(() => {
        if (modalParam === "feedback") {
            setShowPreview(false);
        }
    }, [modalParam]);


    const handleCloseModal = () => {
        setShowModal(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("modal");
        window.history.replaceState({}, "", url);
    };

    useEffect(() => {
        if (currentDate && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(moment(currentDate).format("YYYY-MM-DD"));
        }
    }, [currentDate]);

    return (
        <>
            <MobileMeetingPreviewModal
                isOpen={showPreview}
                data={events}
                onClose={() => { setShowPreview(false); setShowModal(null) }}
                event={selectedEvent}
            />
            <AlertModal
                isOpen={showModal === "alert"}
                onCancel={handleCloseModal}
                onProceed={() => setShowModal(null)}
                value={""}
                onChange={() => { }}
                onClose={handleCloseModal}
            />
            <div className="p-4 space-y-4">
                {groupedEvents.map((eventsByDate: any, index: number) => (
                    <div key={index} className="w-full p-4 rounded-xl bg-white">
                        <p className="font-medium text-sm mb-4">{eventsByDate[0]?.date && moment(eventsByDate[0]?.date).format("DD MMM YYYY")}</p>
                        <div className="space-y-2">
                            {eventsByDate.map((event: any, i: number) => (
                                <div key={i} onClick={() => handleEventClick(event)}>
                                    {renderEventContent(event)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {
                    groupedEvents?.length === 0 &&
                    <div className="h-full min-h-[400px] flex-center">
                        <p className="text-base">No Events Found</p>
                    </div>
                }
            </div>
        </>
    );
};

export default MobileCalender;