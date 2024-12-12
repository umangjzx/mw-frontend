"use client";

import Calendar from "@/components/schedule/Calender";
import MyScheduleModal from "@/components/schedule/Modals/MyScheduleModal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ApprovalModal from "@/components/schedule/Modals/ApprovalModal";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

export default function SchedulePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenApproval, setIsOpenApproval] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const modal = searchParams.get("modal");

    const getEvents = async () => {
        const response: any = await GET_API(
            endpoints.session.getApprovalNotifications(
                "0fd651c9-f10c-4e40-ad7c-13c1c4932fe3",
                "accepted"
            )
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
                    extendedProps: {
                        description: item.session_description,
                        meetLink: item.meet_link,
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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["events"],
        queryFn: () => getEvents(),
    });
    console.log(data, "Events data");

    const handleModal = () => {
        isOpen ? router.push("/volunteer/schedule") : setIsOpen(!isOpen);
    };

    const handleModalApproval = () => {
        isOpenApproval ? router.push("/volunteer/schedule") : setIsOpenApproval(!isOpenApproval);
    };

    useEffect(() => {
        if (modal === "my_schedule") {
            setIsOpen(true);
        } else if (modal === "approval_notification") {
            setIsOpenApproval(true);
        } else {
            setIsOpen(false);
            setIsOpenApproval(false);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-full">
            <Calendar events={data || []} />
            <MyScheduleModal isOpen={isOpen} onClose={handleModal} />
            <ApprovalModal isOpen={isOpenApproval} onClose={handleModalApproval} />
        </div>
    );
}
