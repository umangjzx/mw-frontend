"use client";

import Calendar from "@/components/schedule/Calender";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApprovalModal from "@/components/schedule/Modals/ApprovalModal";
import { POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FeedbackModal from "@/components/schedule/Modals/FeedbackModal";
import { useAppStore } from "@/store/useAppStore";
import Cookies from "js-cookie";
import { getCalendarEvents } from "@/utils/calender";
import { useSendData } from "@/hooks/useReactQuery";
import LottieLoader from "@/components/common/Loader/Lottie";
import { useQueryState } from "nuqs";
import MobileCalender from "@/components/schedule/MobileCalender";
import InnerWidth from "@/utils/innerWidth";

export default function SchedulePage() {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isOpenApproval, setIsOpenApproval] = useState(false);
    const [isOpenFeedback, setIsOpenFeedback] = useState(false);
    const queryClient = useQueryClient();

    const router = useRouter();
    const isMobileOrTabScreen = InnerWidth() < 1024;

    const { eventDetails, currentMonth } = useAppStore();

    const [modal] = useQueryState("modal");
    const volunteerId = Cookies.get("volunteer_id");

    const getEvents = () => getCalendarEvents(volunteerId as string, "volunteer", currentMonth);

    const { data, isFetching } = useQuery({
        queryKey: ["volunteer-events", currentMonth],
        queryFn: getEvents,
    });

    const handleNavigate = () => {
        router.push(`/volunteer/schedule?current_month=${currentMonth}`);
    };

    const handleSubmitFeedback = async (formData: any) => {
        const payload = {
            comment: formData?.notes,
            learner_interest_level: formData?.rating || 0,
            ...eventDetails,
        };
        return await POST_API(endpoints.volunterFeedback.create, payload);
    };

    const { mutate: onSave, isPending } = useSendData({
        fn: (formData: any) => handleSubmitFeedback(formData),
        invalidateKey: ["volunteer-events"],
        success: () => {
            handleNavigate();
            queryClient.invalidateQueries({ queryKey: ["volunteer-events", currentMonth] });
        },
        error: (err) => {
            console.log("Error: ", err);
        },
    });

    useEffect(() => {
        setIsOpenSchedule(modal === "my_schedule");
        setIsOpenApproval(modal === "approval_notification");
        setIsOpenFeedback(modal === "feedback");
    }, [modal]);

    return (
        <div className="w-full h-full animate-fadeIn">
            {isFetching ? (
                <LottieLoader isLoading={true} />
            ) : (
                <>
                    {isMobileOrTabScreen ? (
                        <MobileCalender events={data || []} />
                    ) : (
                        <Calendar events={data || []} />
                    )}
                    <MyScheduleModal isOpen={isOpenSchedule} onClose={handleNavigate} />
                    <ApprovalModal isOpen={isOpenApproval} onClose={handleNavigate} />
                    <FeedbackModal
                        mode="create"
                        isOpen={isOpenFeedback}
                        onClose={handleNavigate}
                        onSubmit={onSave}
                        data={eventDetails}
                        Loading={isPending}
                    />
                </>
            )}
        </div>
    );
}
