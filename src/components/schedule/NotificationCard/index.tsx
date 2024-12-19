"use client";
import Image from "next/image";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Button from "@/components/common/Button";
import { IoMdCheckmark } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { PUT_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useSendData } from "@/hooks/useReactQuery";
import { useState } from "react";
import { cn } from "@/utils/merge-class";

interface NotificationCardProps {
    data: {
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
    };
}

const NotificationCard: React.FC<NotificationCardProps> = ({ data }) => {
    const queryClient = useQueryClient();
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [loadingDecline, setLoadingDecline] = useState(false);
    const formatTime = (start: string, end: string) => {
        if (!start || !end) return "Time not set";

        const formatToAMPM = (time: string) => {
            const [hours, minutes] = time.split(":");
            const hoursNum = parseInt(hours);
            const ampm = hoursNum >= 12 ? "PM" : "AM";
            const formattedHours = hoursNum % 12 || 12;
            return `${formattedHours}:${minutes} ${ampm}`;
        };

        return `${formatToAMPM(start)} - ${formatToAMPM(end)}`;
    };

    const handleNotificationStatus = async (status: string, sessionId: string) => {
        if (status === "accepted") {
            setLoadingAccept(true);
        } else {
            setLoadingDecline(true);
        }
        return await PUT_API(endpoints.session.updateNotificationStatus(sessionId), {
            status: status,
        });
    };

    const { mutate: onSave, isPending } = useSendData({
        // @ts-ignore
        fn: (status: string) => handleNotificationStatus(status, data.session_id),
        invalidateKey: ["events"],
        success: () => {
            queryClient.invalidateQueries({ queryKey: ["approval-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            setLoadingAccept(false);
            setLoadingDecline(false);
        },
        error: (err) => {
            console.log("Error: ", err);
        },
        enabled: !loadingAccept && !loadingDecline,
    });

    return (
        <div className="flex flex-col gap-4 border rounded-xl p-4 border-[#E0E0E0] h-fit w-[360px]">
            <div className="flex items-center gap-2">
                <div>
                    <Image src={DummyProfileImg} alt="notification" width={40} height={40} />
                </div>
                <p className="font-normal">
                    <span className="font-semibold">
                        {`${data.learner_first_name} ${data.learner_last_name}`}
                    </span>{" "}
                    requested for a meeting
                </p>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-medium text-gray-light">Subject</p>
                    <p className="text-sm font-medium">{data.session_title}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-medium text-gray-light">Date</p>
                    <p className="text-sm font-medium">{data.session_date}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-medium text-gray-light">Time</p>
                    <p className="text-sm font-medium">
                        {formatTime(data.session_start_time, data.session_end_time)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full">
                <Button
                    disabled={loadingAccept || loadingDecline}
                    loading={loadingDecline}
                    onClick={() => onSave("rejected")}
                    btnVariant="error"
                    icon={<MdClose className="text-[1.1rem]" />}
                    className={cn(
                        "w-full text-sm  h-9 !bg-error-light !border-error-light rounded-xl py-2 hover:!text-error",
                        loadingDecline && "!bg-error-light !border-error-light !cursor-not-allowed"
                    )}
                >
                    Decline
                </Button>
                <Button
                    disabled={loadingAccept || loadingDecline}
                    loading={loadingAccept}
                    onClick={() => onSave("accepted")}
                    btnVariant="success"
                    icon={<IoMdCheckmark className="text-[1.1rem]" />}
                    className={cn(
                        "w-full text-sm h-9 !bg-success-light !border-success-light rounded-xl py-2 hover:!text-success",
                        loadingAccept &&
                            "!bg-success-light !border-success-light !cursor-not-allowed"
                    )}
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};

export default NotificationCard;
