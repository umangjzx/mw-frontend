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
import { useVolunteer } from "@/store/useVolunteer";
import { useAppStore } from "@/store/useAppStore";

export default function SchedulePage() {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isOpenApproval, setIsOpenApproval] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const modal = searchParams.get("modal");
    const currentDate = searchParams.get("current_month");
    const [isOpenFeedback, setIsOpenFeedback] = useState(true);
    const { eventDetails, currentMonth } = useAppStore();

    const getEvents = async () => {
        const monthParam = currentDate
            ? moment(currentDate).format("YYYY-MM")
            : moment().format("YYYY-MM");

        const response: any = await GET_API(
            endpoints.session.getCalendarEvents("0fd651c9-f10c-4e40-ad7c-13c1c4932fe3", monthParam)
        );
        if (response?.data?.items) {
            const events =
                response?.data?.items?.map((item: any) => ({
                    title: item.session_title,
                    date: item.session_date,
                    start: moment(`${item.session_date} ${item.session_start_time}`).format(),
                    end: moment(`${item.session_date} ${item.session_end_time}`).format(),
                    backgroundColor: "var(--success-light-color)",
                    classNames: ["event-item", "rounded-md", "px-3", "py-1", "my-0.5"],
                    textColor: "var(--success-color)",
                    borderColor: "var(--success-color)",
                    status: item.status,
                    extendedProps: {
                        description: item.session_description,
                        meetLink: item.meet_link,
                        sessionId: item.session_id,
                        volunteerId: item.volunteer_id,
                        learner: {
                            id: item.learner_id,
                            firstName: item.learner_first_name,
                            lastName: item.learner_last_name,
                            picture: item.learner_picture,
                        },
                    },
                })) || [];
            return events;
        }
        return [];
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["events", currentDate],
        queryFn: () => getEvents(),
    });

    const handleModal = () => {
        isOpenSchedule
            ? router.push(`/volunteer/schedule?current_month=${currentMonth}`)
            : setIsOpenSchedule(!isOpenApproval);
    };

    const handleModalApproval = () => {
        isOpenApproval
            ? router.push(`/volunteer/schedule?current_month=${currentMonth}`)
            : setIsOpenApproval(!isOpenApproval);
    };

    const handleModalFeedback = () => {
        isOpenFeedback
            ? router.push(`/volunteer/schedule?current_month=${currentMonth}`)
            : setIsOpenFeedback(!isOpenFeedback);
    };

    const handleSubmitFeedback = (formData: any) => {
        let payload = {
            comment: formData?.notes,
            learner_interest_level: formData?.rating || 0,
            ...eventDetails,
        };
        POST_API(endpoints.volunterFeedback.create, payload)
            .then((res) => {
                handleModalFeedback();
            })
            .catch((err) => {
                console.log(err, "err for feedback");
            });
    };

    useEffect(() => {
        if (modal === "my_schedule") {
            setIsOpenSchedule(true);
        } else if (modal === "approval_notification") {
            setIsOpenApproval(true);
        } else if (modal === "feedback") {
            setIsOpenFeedback(true);
        } else {
            setIsOpenSchedule(false);
            setIsOpenApproval(false);
            setIsOpenFeedback(false);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-full">
            <Calendar events={data || []} />
            <MyScheduleModal isOpen={isOpenSchedule} onClose={handleModal} />
            <ApprovalModal isOpen={isOpenApproval} onClose={handleModalApproval} />
            <FeedbackModal
                mode="create"
                isOpen={isOpenFeedback}
                onClose={handleModalFeedback}
                onSubmit={handleSubmitFeedback}
                data={eventDetails}
            />
        </div>
    );
}
