"use client";

import Calendar from "@/components/schedule/Calender";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ApprovalModal from "@/components/schedule/Modals/ApprovalModal";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import FeedbackModal from "@/components/schedule/Modals/FeedbackModal";
import { useAppStore } from "@/store/useAppStore";
import Cookies from "js-cookie";
import { getCalendarEvents } from "@/utils/calender";

export default function SchedulePage() {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isOpenApproval, setIsOpenApproval] = useState(false);
    const [isOpenFeedback, setIsOpenFeedback] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { eventDetails, currentMonth } = useAppStore();
    const modal = searchParams.get("modal");
    const volunteerId = Cookies.get("volunteer_id");

    const getEvents = () => getCalendarEvents(volunteerId as string, "volunteer", currentMonth);

    const { data } = useQuery({
        queryKey: ["events", currentMonth],
        queryFn: getEvents,
    });

    const handleNavigate = () => {
        router.push(`/volunteer/schedule?current_month=${currentMonth}`);
    };

    const handleSubmitFeedback = async (formData: any) => {
        try {
            const payload = {
                comment: formData?.notes,
                learner_interest_level: formData?.rating || 0,
                ...eventDetails,
            };
            await POST_API(endpoints.volunterFeedback.create, payload);
            handleNavigate();
        } catch (err) {
            console.log(err, "err for feedback");
        }
    };

    useEffect(() => {
        setIsOpenSchedule(modal === "my_schedule");
        setIsOpenApproval(modal === "approval_notification");
        setIsOpenFeedback(modal === "feedback");
    }, [modal]);

    return (
        <div className="w-full h-full">
            <Calendar events={data || []} />
            <MyScheduleModal isOpen={isOpenSchedule} onClose={handleNavigate} />
            <ApprovalModal isOpen={isOpenApproval} onClose={handleNavigate} />
            <FeedbackModal
                mode="create"
                isOpen={isOpenFeedback}
                onClose={handleNavigate}
                onSubmit={handleSubmitFeedback}
                data={eventDetails}
            />
        </div>
    );
}
