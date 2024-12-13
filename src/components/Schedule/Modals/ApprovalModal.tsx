import SideModal from "@/components/common/Modals/SideModal";
import React, { useState, useEffect } from "react";
import NotificationCard from "@/components/schedule/NotificationCard";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";

interface NotificationData {
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
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
    const [notificationsData, setNotificationsData] = useState<NotificationData[]>([]);

    const getNotifications = async () => {
        const response: any = await GET_API(
            endpoints.session.getApprovalNotifications(
                "0fd651c9-f10c-4e40-ad7c-13c1c4932fe3",
                "pending"
            )
        );
        console.log(response?.data, "Response from getApprovalNotifications");
        return response?.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["approval-notifications"], // TODO: change to queryKey: ["notifications", { id: "0fd651c9-f10c-4e40-ad7c-13c1c4932fe3" }],
        queryFn: () => getNotifications(),
    });

    useEffect(() => {
        if (data) {
            const transformedData = data.items.map((item: any) => ({
                learner_first_name: item.learner_first_name,
                learner_last_name: item.learner_last_name,
                learner_picture: {
                    image_url: item.learner_picture.image_url,
                },
                session_date: item.session_date,
                session_start_time: item.session_start_time,
                session_end_time: item.session_end_time,
                session_title: item.session_title,
                session_id: item.session_id,
            }));
            setNotificationsData(transformedData);
        }
    }, [data]);

    const handleSave = () => {
        console.log("save");
    };

    return (
        <SideModal
            title="Approval Notifications"
            onClose={onClose}
            isOpen={isOpen}
            isNeedButton={false}
        >
            <div className="flex flex-col gap-4 px-5 mt-7">
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error loading notifications</p>
                ) : (
                    notificationsData.map((notification) => (
                        <NotificationCard key={notification.session_id} data={notification} />
                    ))
                )}
            </div>
        </SideModal>
    );
};

export default ApprovalModal;
