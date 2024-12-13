"use client";

import Calendar from "@/components/schedule/Calender";
import AddNewMeetingModal from "@/components/schedule/Modals/AddNewMeetingModal";
import FeedbackModal from "@/components/schedule/Modals/FeedbackModal";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { useAppStore } from "@/store/useAppStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

export default function SchedulePage() {
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const pathname = usePathname();
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
            ? router.push(`/learner/schedule?current_month=${currentMonth}`)
            : setIsOpenSchedule(!isOpenSchedule);
    };

    const handleModalFeedback = () => {
        isOpenFeedback
            ? router.push(`/learner/schedule?current_month=${currentMonth}`)
            : setIsOpenFeedback(!isOpenFeedback);
    };

    const handleSubmitFeedback = (formData: any) => {
        let payload = {
            comment: formData?.notes,
            volunteer_commitment_level: formData?.rating || 0,
            ...eventDetails,
        };
        POST_API(endpoints.learnerFeedback.create, payload)
            .then((res) => {
                handleModalFeedback();
            })
            .catch((err) => {
                console.log(err, "err for feedback");
            });
    };

    useEffect(() => {
        const modal = searchParams.get("modal");
        if (modal === "add_new_meeting") {
            setIsOpenSchedule(true);
        } else if (modal === "feedback") {
            setIsOpenFeedback(true);
        } else {
            setIsOpenSchedule(false);
            setIsOpenFeedback(false);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-full">
            <AddNewMeetingModal isOpen={isOpenSchedule} onClose={handleModal} />
            <Calendar events={data || []} />
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
