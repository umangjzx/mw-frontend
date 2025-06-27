import SideModal from "@/components/common/Modals/SideModal";
import React, { useState, useEffect } from "react";
import NotificationCard from "@/components/schedule/NotificationCard";
import { NotificationCardSkeleton } from "@/components/schedule/NotificationCard";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";
import moment from "moment";
import InnerWidth from "@/utils/innerWidth";

type SessionsData = {
    learner_first_name: string;
    learner_last_name: string;
    learner_picture: {
        image_url: string;
    };
    session_date: string;
    session_start_time: string;
    session_end_time: string;
    session_title: string;
    session_id: string;
    overlapped_slot: boolean;
    volunteer_start_time: string;
    volunteer_end_time: string;
    volunteer_start_date: string;
}

interface NotificationData {
    date: string;
    sessions: SessionsData[];
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
    const [notificationsData, setNotificationsData] = useState<NotificationData[]>([]);
    const volunteerId = Cookies.get("volunteer_id");

    const getNotifications = async () => {
        const response: any = await GET_API(
            endpoints.session.getApprovalNotifications(volunteerId as string)
        );
        console.log("Response from getApprovalNotifications: ", response?.data);
        return response?.data;
    };

    const { data, isFetching, isError } = useQuery({
        queryKey: ["approval-notifications", isOpen],
        queryFn: () => getNotifications(),
        enabled: isOpen,
    });

    useEffect(() => {
        if (data) {
            const transformedData = data?.items || [];
            setNotificationsData(transformedData);
        }
    }, [data]);

    const isMobileScreen = InnerWidth() < 768;

    return (
        <SideModal
            title="Approval Notifications"
            onClose={onClose}
            isOpen={isOpen}
            isNeedButton={false}
            modalWidth={isMobileScreen ? "100%" : 400}
        >
            <div className="flex flex-col gap-4 px-5 mt-5">
                {isFetching ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <NotificationCardSkeleton key={index} />
                        ))}
                    </div>
                ) : isError ? (
                    <p>Error loading notifications</p>
                ) : notificationsData.length > 0 ? (
                    notificationsData.map((notification) => (
                        <div>
                            <div className="relative inline-flex items-center justify-center w-full">
                                <hr className="w-full h-px my-6 bg-gray-light border-0" />
                                <span className="absolute -translate-x-1/2 left-1/2 px-3 font-semibold !text-sm !text-gray-light !bg-white">{moment(notification?.date).format("D MMM YYYY")}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {notification?.sessions?.map(session => (
                                    <NotificationCard key={session?.session_id} data={session} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col gap-4 border rounded-xl p-4 border-[#E0E0E0] h-fit lg:w-[360px] items-center justify-center">
                        <p className="text-gray-light text-sm font-medium">
                            No Notifications Available
                        </p>
                    </div>
                )}
            </div>
        </SideModal>
    );
};

export default ApprovalModal;
