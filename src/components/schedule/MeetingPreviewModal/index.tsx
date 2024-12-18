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
    const router = useRouter();
    const { currentMonth } = useAppStore();
    const role = Cookies.get("role");

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // Small delay to ensure the initial state is applied before transition
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
    const queryClient = useQueryClient();
    const eventData = event._def;
    // Use event.start and event.end directly
    const startTime = moment(event.start).local().format("dddd, MMMM D, h:mm A");
    const endTime = moment(event.end).local().format("h:mm A");
    const { title, extendedProps } = eventData;
    const { meetLink, learner, status, sessionId, feedBackCollected } = extendedProps;
    console.log(feedBackCollected, "extendedProps from meeting preview modal");

    const handleNotificationStatus = (status: string, sessionId: string) => {
        PUT_API(endpoints.session.updateNotificationStatus(sessionId), {
            status: status,
        })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["approval-notifications"] });
                queryClient.invalidateQueries({ queryKey: ["events"] });
                onClose();
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    const handleFeedBack = () => {
        router.push(`/${role}/schedule?current_month=${currentMonth}&modal=feedback`);
    };

    const handleMarkAsCompleted = () => {
        PUT_API(endpoints.session.markAsCompleted(sessionId), {}).then(() => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onClose();
        });
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
                            Completed Feedback
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
                                customClassName="w-fit bg-white !text-black text-sm rounded-full !py-0 !px-5"
                                onClick={() => navigator.clipboard.writeText(meetLink)}
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
                            onClick={() => handleNotificationStatus("rejected", sessionId)}
                            btnVariant="error"
                            icon={<MdClose className="text-[1.1rem]" />}
                            className="w-full text-sm  h-9 !bg-error-light !border-error-light rounded-xl py-2 hover:!text-error"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={() => handleNotificationStatus("accepted", sessionId)}
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
