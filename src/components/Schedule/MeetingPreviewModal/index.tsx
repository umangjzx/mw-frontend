"use client";
import React from "react";
import FeedModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import Divider from "@/components/common/Divider";
import Button from "@/components/common/Button";
import { createPortal } from "react-dom";
import moment from "moment";

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
    if (!isOpen || !event) return null;

    const eventData = event._def;
    // Use event.start and event.end directly
    const startTime = moment(event.start).local().format("dddd, MMMM D, h:mm A");
    const endTime = moment(event.end).local().format("h:mm A");

    const { title, extendedProps } = eventData;
    const { meetLink, learner } = extendedProps;

    return createPortal(
        <div
            className="meeting-preview-modal border border-stroke bg-white rounded-lg shadow-lg"
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
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-sm text-gray-light">Guest</p>
                    <p className="text-black font-medium">
                        {learner
                            ? `${learner.firstName} ${learner.lastName}`
                            : "No guest information"}
                    </p>
                </div>
                <Divider />
                <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-sm text-[#16A34A]">Feedback Completed</p>
                    <p className="text-primary text-sm underline font-medium">See Feedback</p>
                </div>
                <Divider />
                <div className="flex items-center justify-between gap-3">
                    <p className="text-gray-light font-medium text-sm">Availability Status</p>
                    <Button
                        title="Mark as Available"
                        customClassName="w-fit bg-white !text-[#DC2626] border border-[#DC2626] text-sm rounded-full !py-0 !px-5"
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MeetingPreviewModal;
