"use client";

import React, { useState } from "react";
import Image from "next/image";
import CenterModal from "@/components/common/Modals/CenterModal";
import Button from "@/components/common/Button";
import { TimeIcon, HostedByIcon, VerifyTickIcon } from "@/assets/icons";
import PersonImg from "@/assets/images/Person.png";

interface ConfirmationSuccessfulModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: {
        id: string;
        title: string;
        startTime: string;
        endTime: string;
        timezone: string;
        duration: string;
        instructor: {
            name: string;
            profilePicture?: string;
        };
        meetingLink?: string;
        guests?: string[];
        is_learner?: boolean;
    };
    onCancelMeeting?: () => void;
    onJoinMeeting?: () => void;
}

const ConfirmationSuccessfulModal: React.FC<ConfirmationSuccessfulModalProps> = ({
    isOpen,
    onClose,
    session,
    onCancelMeeting,
    onJoinMeeting,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (session.meetingLink) {
            navigator.clipboard.writeText(session.meetingLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleJoinMeeting = () => {
        if (session.meetingLink) {
            window.open(session.meetingLink, "_blank");
        }
    };

    const handleCancelMeeting = () => {
        if (onCancelMeeting) {
            onCancelMeeting();
        }
        onClose();
    };

    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}
            width={500}
            zIndex={2000}
            hideCloseIcon={false}
            headerComponent={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center">
                            <VerifyTickIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-[20px] font-medium text-[#121212]">Confirmation Successful</h2>
                    </div>
                </div>
            }
            headerClassName="!px-6 !py-5 !border-0 !justify-between relative"
            bodyClassName="!px-6 !pt-6 !pb-6 relative"
            customClassName="!rounded-2xl [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_*[class*='dot']]:!hidden [&_*[class*='pagination']]:!hidden [&_*[class*='indicator']]:!hidden [&_.ant-modal-close]:!pr-2"
            rootClassName="!rounded-2xl !overflow-hidden"
            hideFooter={true}
        >
            <div className="flex flex-col relative">
                {/* Partial Border Line - From icon start to close icon end */}
                <div className="absolute left-0 right-0 -top-6 border-t border-gray-200" style={{ left: '8px', right: '8px' }}></div>
                {/* Event Title */}
                <h3 className="text-[20px] font-medium text-[#121212] mb-4">{session.title}</h3>

                {/* Event Details */}
                <div className="flex flex-col gap-3 mb-4">
                    {/* Duration Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center !mb-1 w-4 h-4 text-gray-600 flex-shrink-0">
                                <TimeIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-[#4F4F4F]">Duration</span>
                        </div>
                        <span className="text-sm font-medium text-[#121212]">
                            {session.startTime} - {session.endTime} {session.timezone} ({session.duration})
                        </span>
                    </div>

                    {/* Hosted By Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-4 h-4 !mb-1 text-gray-600 flex-shrink-0">
                                <HostedByIcon />
                            </div>
                            <span className="text-sm font-medium text-[#4F4F4F]">Hosted By</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src={session.instructor.profilePicture && session.instructor.profilePicture !== "/dummy-profile.webp"
                                        ? session.instructor.profilePicture
                                        : PersonImg}
                                    alt={session.instructor.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-sm font-medium text-[#121212]">{session.instructor.name}</span>
                        </div>
                    </div>
                </div>

                {/* Join Section - Gray Container */}
                <div className="rounded-xl py-3 mb-4">
                    {/* Top Row - Buttons Side by Side */}
                    <div className="flex items-start justify-between gap-2 pb-2">
                        {/* Left Column - Join Button and Meeting Link */}
                        <div className="flex flex-col">
                            {/* Join with Google Meet Button */}
                            <Button
                                title="Join with Google Meet"
                                btnVariant="secondary"
                                customClassName="!w-[207px] !h-11 !bg-[#68DBFF] !text-[#121212] hover:!bg-[#B3E5FC] !font-medium !rounded-xl"
                                onClick={handleJoinMeeting}
                            />
                            {/* Meeting Link - Directly below Join Button, no padding */}
                            <div className="w-[207px] mt-0">
                                {session.meetingLink ? (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] text-[#000000] font-medium hover:underline break-words"
                                    >
                                        {session.meetingLink}
                                    </a>
                                ) : (
                                    <span className="text-[12px] text-[#000000] font-medium">—</span>
                                )}
                            </div>
                        </div>
                        {/* Copy Link Button - Right, at the end */}
                        <Button
                            title={copied ? "Copied!" : "Copy Link"}
                            btnVariant="tertiary"
                            customClassName="!w-[100px] !h-8 !bg-white !text-black !border !border-gray-300 !px-6 !mt-4 !rounded-full flex items-center justify-center"
                            onClick={handleCopyLink}
                        />
                    </div>
                </div>

                {/* Guest Section */}
                <div className="flex flex-col gap-2 mb-4 relative py-2">
                    {/* Partial Border Line - Above Guest Section */}
                    <div className="absolute left-0 right-0 -top-4 border-t border-gray-200" style={{ left: '0px', right: '0px' }}></div>
                    <span className="text-sm font-medium text-[#4F4F4F]">Guest</span>
                    <div className="flex flex-wrap gap-1">
                        {session.guests && session.guests.length > 0 ? (
                            session.guests.map((guest, index) => {
                                const guestsLength = session.guests?.length ?? 0;
                                return (
                                    <span key={index} className="text-sm text-gray-700">
                                        {guest}
                                        {index === 0 && " (Host)"}
                                        {index < guestsLength - 1 && ", "}
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-sm text-[#4F4F4F]">—</span>
                        )}
                    </div>
                    {/* Partial Border Line - Below Guest Section */}
                    <div className="absolute left-0 right-0 -bottom-4 border-t border-gray-200" style={{ left: '0px', right: '0px' }}></div>
                </div>

                {/* Full Border Line - Above Cancel Meeting Button */}
                <div className="border-t border-gray-200 -mx-6 my-4"></div>

                {/* Footer Action - Cancel Meeting Button */}
                <div className="flex justify-end">
                    <Button
                        title="Cancel Meeting"
                        btnVariant="tertiary"
                        customClassName="!h-10 !bg-white !text-red-600 !border !border-red-600 hover:!bg-red-50 !font-medium !rounded-full !px-6"
                        onClick={handleCancelMeeting}
                    />
                </div>
            </div>
        </CenterModal>
    );
};

export default ConfirmationSuccessfulModal;
