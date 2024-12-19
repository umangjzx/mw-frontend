"use client";
import { endpoints } from "@/api/constants";
import { PUT_API } from "@/api/request";
import FeedModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import Button from "@/components/common/Button";
import Divider from "@/components/common/Divider";
import { useAppStore } from "@/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdCheckmark } from "react-icons/io";
import { MdClose } from "react-icons/md";
import "./styles.css";
import Cookies from "js-cookie";
import { showToast } from "@/components/common/Toast";
import { useSendData } from "@/hooks/useReactQuery";

interface MeetingPreviewModalProps {
    data: any;
    isOpen: boolean;
    onClose: () => void;
    event: any;
    style?: React.CSSProperties;
    onMouseLeave?: () => void;
}

const MeetingPreviewModal: React.FC<MeetingPreviewModalProps> = ({
    isOpen,
    onClose,
    event,
    style,
    onMouseLeave,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [loadingDecline, setLoadingDecline] = useState(false);

    const router = useRouter();
    const queryClient = useQueryClient();
    const { currentMonth } = useAppStore();
    const role = Cookies.get("role");

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
        fn: (status: string) => handleNotificationStatus(status, sessionId),
        invalidateKey: ["events"],
        success: () => {
            queryClient.invalidateQueries({ queryKey: ["approval-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            setLoadingAccept(false);
            setLoadingDecline(false);
        },
        error: (err) => {
            console.log("Error: ", err);
            setLoadingAccept(false);
            setLoadingDecline(false);
        },
    });

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if ((!isAnimating && !isOpen) || !event) return null;

    const eventData = event._def;
    const startTime = moment(event.start).local().format("dddd, MMMM D, h:mm A");
    const endTime = moment(event.end).local().format("h:mm A");
    const { title, extendedProps } = eventData;
    const { meetLink, learner, status, sessionId, feedBackCollected } = extendedProps;

    const handleFeedBack = () => {
        router.push(`/${role}/schedule?current_month=${currentMonth}&modal=feedback`);
    };

    const handleMarkAsCompleted = () => {
        PUT_API(endpoints.session.markAsCompleted(sessionId), {}).then(() => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onClose();
        });
    };

    const handleLinkCopy = () => {
        navigator.clipboard.writeText(meetLink);
        showToast({ type: "success", message: "Link copied to clipboard" });
    };

    const renderFeedback = () => {
        if (!feedBackCollected) {
            return (
                <div>
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm text-gray-light">Meeting Completed</p>
                        <p
                            onClick={handleFeedBack}
                            className="text-primary text-sm underline cursor-pointer font-medium"
                        >
                            Complete Feedback
                        </p>
                    </div>
                </div>
            );
        } else if (feedBackCollected) {
            return (
                <div>
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm text-success">Feedback Completed</p>
                        {/* <p
                            onClick={handleFeedBack}
                            className="text-primary text-sm underline font-medium"
                        >
                            See Feedback
                        </p> */}
                    </div>
                </div>
            );
        }
    };

    return createPortal(
        <div
            className={`meeting-preview-modal border border-stroke bg-white rounded-lg shadow-lg ${
                isVisible ? "modal-visible" : "modal-hidden"
            }`}
            style={{
                ...style,
                position: "fixed",
                zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex flex-col gap-6 p-5">
                <div className="flex justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-xl text-black">{title}</p>
                        <p className="text-gray-light font-medium text-sm">
                            {`${startTime} - ${endTime}`}
                        </p>
                    </div>
                    <Button
                        onClick={onClose}
                        customClassName="!bg-transparent !border-none !p-0 !w-fit !h-fit"
                    >
                        <FeedModalCloseIcon />
                    </Button>
                </div>
                <Divider />
                {status === "accepted" && (
                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => window.open(meetLink, "_blank")}
                                    title="Join with Google Meet"
                                    customClassName="w-fit !bg-background-secondary rounded-xl !outline-none !border-none !text-black"
                                />
                                <p className="font-medium text-[12px] ml-1">{meetLink}</p>
                            </div>
                            <Button
                                title="Copy Link"
                                customClassName="w-fit !bg-white hover:!bg-white !text-black text-sm rounded-full !py-0 !px-5"
                                onClick={handleLinkCopy}
                            />
                        </div>
                        <Divider />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-sm text-gray-light">Guest</p>
                    <p className="text-black font-medium">
                        {learner
                            ? `${learner.firstName} ${learner.lastName}`
                            : "No guest information"}
                    </p>
                </div>
                <Divider />
                {status === "completed" && renderFeedback()}
                {status === "accepted" && (
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-gray-light font-medium text-sm">Availability Status</p>
                        {status === "accepted" ? (
                            <Button
                                onClick={() => handleMarkAsCompleted()}
                                title="Mark as completed"
                                customClassName="w-fit bg-white !text-[#DC2626] border border-[#DC2626] text-sm rounded-full !py-0 !px-5"
                            />
                        ) : (
                            <p className="text-[#DC2626] font-medium text-xs">
                                {`${learner.firstName} completed the meeting`}
                            </p>
                        )}
                    </div>
                )}
                {status === "pending" && role === "volunteer" && (
                    <div className="flex items-center gap-2 w-full">
                        <Button
                            disabled={loadingAccept || loadingDecline}
                            loading={loadingDecline}
                            onClick={() => onSave("rejected")}
                            btnVariant="error"
                            icon={<MdClose className="text-[1.1rem]" />}
                            className="w-full text-sm  h-9 !bg-error-light !border-error-light rounded-xl py-2 hover:!text-error"
                        >
                            Decline
                        </Button>
                        <Button
                            disabled={loadingAccept || loadingDecline}
                            loading={loadingAccept}
                            onClick={() => onSave("accepted")}
                            btnVariant="success"
                            icon={<IoMdCheckmark className="text-[1.1rem]" />}
                            className="w-full text-sm h-9 !bg-success-light !border-success-light rounded-xl py-2 hover:!text-success "
                        >
                            Accept
                        </Button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default MeetingPreviewModal;
