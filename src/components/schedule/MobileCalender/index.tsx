"use client";

import { useAppStore } from "@/store/useAppStore";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MeetingPreviewModal from "../MeetingPreviewModal";
import { AlertModal, AllEventsModal } from "../Modals";

interface CalendarProps {
    events: any;
}

const MobileCalender: React.FC<CalendarProps> = ({ events }) => {
    const [showModal, setShowModal] = useState<ModalType>(null);
    const [currentEventData, setCurrentEventData] = useState<{
        events: any;
        date: string;
        w?: any;
    }>({
        events: [],
        date: "",
    });

    const [showPreview, setShowPreview] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<any | null>(null);
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


    const handleCloseModal = () => {
        setShowModal(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("modal");
        window.history.replaceState({}, "", url);
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

    useEffect(() => {
        if (currentDate && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(moment(currentDate).format("YYYY-MM-DD"));
        }
    }, [currentDate]);

    useEffect(() => {
        setEventDetails(selectedEventForFeedback);
    }, [selectedEventForFeedback]);

    return (
        <>
            <AlertModal
                isOpen={showModal === "alert"}
                onCancel={handleCloseModal}
                onProceed={() => setShowModal(null)}
                value={""}
                onChange={() => { }}
                onClose={handleCloseModal}
            />
            <div className="p-4 calendar-container">
                {
                    events.map((event:any) => (
                        <div className="w-full p-4">

                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default MobileCalender;