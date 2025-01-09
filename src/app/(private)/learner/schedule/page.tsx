"use client";

import Calendar from "@/components/schedule/Calender";
import AddNewMeetingModal from "@/components/schedule/Modals/AddNewMeetingModal";
import FeedbackModal from "@/components/schedule/Modals/FeedbackModal";
import { useAppStore } from "@/store/useAppStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { checkCalendarScope, getCalendarEvents } from "@/utils/calender";
import { useQueryClient } from "@tanstack/react-query";
import { useSendData } from "@/hooks/useReactQuery";
import CalendarAccessScreen from "@/components/common/CalendarAccessScreen";
import LottieLoader from "@/components/common/Loader/Lottie";
import { useQueryState } from "nuqs";

export default function LearnerSchedulePage() {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isOpenFeedback, setIsOpenFeedback] = useState(false);
    const [isCalendarScope, setIsCalendarScope] = useState("checking");

    const router = useRouter();
    const { eventDetails, currentMonth } = useAppStore();
    const queryClient = useQueryClient();

    const [modal] = useQueryState("modal");
    const learnerId = Cookies.get("learner_id");

    const getEvents = () => getCalendarEvents(learnerId as string, "learner", currentMonth);

    const { data } = useQuery({
        queryKey: ["learner-events", currentMonth],
        queryFn: getEvents,
    });

    const handleNavigate = () => {
        router.push(`/learner/schedule?current_month=${currentMonth}`);
    };

    const handleSubmitFeedback = async (formData: any) => {
        const payload = {
            comment: formData?.notes,
            volunteer_commitment_level: formData?.rating || 0,
            ...eventDetails,
        };
        return await POST_API(endpoints.learnerFeedback.create, payload);
    };

    const { mutate: onSave, isPending } = useSendData({
        fn: (formData: any) => handleSubmitFeedback(formData),
        invalidateKey: ["events"],
        success: () => {
            handleNavigate();
            queryClient.invalidateQueries({ queryKey: ["events", currentMonth] });
        },
        error: (err) => {
            console.log("Error: ", err);
        },
    });

    useEffect(() => {
        setIsOpenSchedule(modal === "add_new_meeting");
        setIsOpenFeedback(modal === "feedback");
    }, [modal]);

    useEffect(() => {
        checkCalendarScope().then((res) => {
            setIsCalendarScope(res.data.calendar_access_enabled);
        });
    }, []);

    return (
        <>
            { isCalendarScope === "checking" ? <LottieLoader isLoading={true} />
                : !isCalendarScope ? (
                    <CalendarAccessScreen />
                ) : (
                    <div className="w-full h-full animate-fadeIn">
                        <Calendar events={data || []} />
                        <AddNewMeetingModal isOpen={isOpenSchedule} onClose={handleNavigate} />
                        <FeedbackModal
                            mode="create"
                            isOpen={isOpenFeedback}
                            onClose={handleNavigate}
                            onSubmit={onSave}
                            data={eventDetails}
                            Loading={isPending}
                        />
                    </div>
                )}
        </>
    );
}
