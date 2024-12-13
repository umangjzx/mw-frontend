"use client";
import React, { useEffect, useState } from "react";
import FeedModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import Divider from "@/components/common/Divider";
import Button from "@/components/common/Button";
import { createPortal } from "react-dom";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/constants";
import { PUT_API } from "@/api/request";
import { IoMdCheckmark } from "react-icons/io";
import { MdClose } from "react-icons/md";
import "./styles.css";

interface MeetingPreviewModalProps {
    data: any;
    isOpen: boolean;
    onClose: () => void;
    event: any;
    style?: React.CSSProperties;
}

const MeetingPreviewModal: React.FC<MeetingPreviewModalProps> = ({
    isOpen,
    onClose,
    event,
    style,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

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
    const { meetLink, learner, status, sessionId } = extendedProps;

    const handleNotificationStatus = (status: string, sessionId: string) => {
        PUT_API(endpoints.session.updateNotificationStatus(sessionId), {
            status: status,
        })
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["approval-notifications"] });
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
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
                {/* <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-sm text-[#16A34A]">Feedback Completed</p>
                    <p className="text-primary text-sm underline font-medium">See Feedback</p>
                </div>
                <Divider /> */}
                {status === "rejected" && (
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-gray-light font-medium text-sm">Availability Status</p>
                        {/* <Button
                            title="Mark as Available"
                            customClassName="w-fit bg-white !text-[#DC2626] border border-[#DC2626] text-sm rounded-full !py-0 !px-5"
                        /> */}
                        {status === "rejected" && (
                            <p className="text-[#DC2626] font-medium text-xs">
                                {`${learner.firstName} rejected your meeting request.`}
                            </p>
                        )}
                    </div>
                )}
                {status === "pending" && (
                    <div className="flex items-center gap-2 w-full">
                        <Button
                            onClick={() => handleNotificationStatus("rejected", sessionId)}
                            btnVariant="error"
                            icon={<MdClose className="text-[1.1rem]" />}
                            className="w-full text-sm h-9 border-error-light rounded-xl py-2"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={() => handleNotificationStatus("accepted", sessionId)}
                            btnVariant="success"
                            icon={<IoMdCheckmark className="text-[1.1rem]" />}
                            className="w-full text-sm h-9 border-success-light rounded-xl py-2"
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
