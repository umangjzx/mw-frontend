"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CenterModal from "@/components/common/Modals/CenterModal";
import TagComponent from "@/components/common/Tag";
import Button from "@/components/common/Button";
import ClaimConfirmationModal from "./ClaimConfirmationModal";
import PersonImg from "@/assets/images/Person.png";
import { TimeIcon, HostedByIcon } from "@/assets/icons";
import { POST_API, GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { showToast } from "@/components/common/Toast";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

interface InstantSessionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: {
        id: string;
        title: string;
        status: "available" | "claimed";
        tags: string[];
        description: string;
        startTime: string;
        endTime: string;
        timezone: string;
        duration: string;
        date?: string;
        volunteer_id?: string;
        start_time_24?: string;
        end_time_24?: string;
        instructor: {
            name: string;
            profilePicture?: string;
        };
    };
    onClaim?: () => void;
    showNote?: boolean;
}

const InstantSessionDetailModal: React.FC<InstantSessionDetailModalProps> = ({
    isOpen,
    onClose,
    session,
    onClaim,
    showNote = false,
}) => {
    const queryClient = useQueryClient();
    const learnerId = Cookies.get("learner_id");
    const statusConfig = {
        available: {
            bg: "!bg-[#DCFCE7]",
            text: "!text-[#16A34A]",
            label: "Available",
        },
        claimed: {
            bg: "!bg-[#DFF5FF]",
            text: "!text-[#0096CC]",
            label: "Claimed",
        },
    };

    const status = statusConfig[session.status] || statusConfig.available;
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isValidated, setIsValidated] = useState<boolean>(true);
    const [isCheckingValidation, setIsCheckingValidation] = useState(false);

    useEffect(() => {
        if (isOpen && !isConfirmationModalOpen) {
            const checkValidation = async () => {
                setIsCheckingValidation(true);
                try {
                    const sessionDate = session.date || "";
                    const startTime = session.start_time_24 || "";
                    const endTime = session.end_time_24 || "";

                    if (!sessionDate || !startTime || !endTime) {
                        setIsValidated(true); // Fallback or handle error
                        return;
                    }

                    const res: any = await GET_API(endpoints.session.validateInstantSession(sessionDate, startTime, endTime));

                    // Support both is_valid and is_validate (image showed is_validate, text showed is_valid)
                    const isValid = res?.data?.is_valid !== undefined ? res.data.is_valid : res.data?.is_validate;

                    if (typeof isValid === "boolean") {
                        setIsValidated(isValid);
                    }
                } catch (error) {
                    console.error("Validation check failed:", error);
                } finally {
                    setIsCheckingValidation(false);
                }
            };
            checkValidation();
        }
    }, [isOpen, isConfirmationModalOpen]);

    const displayNote = !isValidated || showNote;
    const isClaimDisabled = !isValidated || isCheckingValidation;

    const handleClaim = () => {
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmClaim = async (): Promise<boolean> => {
        const volunteerId = session.volunteer_id;
        const volunteerSlotId = session.id;
        const sessionDate = session.date;
        const startTime24 = session.start_time_24;
        const endTime24 = session.end_time_24;

        if (!volunteerId || !volunteerSlotId || !sessionDate || !learnerId) {
            showToast({ message: "Missing session or learner details. Cannot claim.", type: "error" });
            return false;
        }
        if (!startTime24 || !endTime24) {
            showToast({ message: "Missing session time. Cannot claim.", type: "error" });
            return false;
        }

        setIsClaiming(true);
        try {
            const res = await POST_API(endpoints.session.claimInstantSession, {
                volunteer_id: volunteerId,
                volunteer_slot_id: volunteerSlotId,
                session_date: sessionDate,
                session_title: session.title,
                session_description: session.description ?? "",
                session_start_time: startTime24,
                session_end_time: endTime24,
                learner_id: learnerId,
            });
            if (res?.status === 200 || res?.status === 201) {
                showToast({ message: "Session claimed successfully", type: "success" });
                queryClient.invalidateQueries({ queryKey: ["learner-instant-sessions"] });
                queryClient.invalidateQueries({ queryKey: ["learner-accepted-instant-sessions"] });
                onClaim?.();
                return true;
            }
            showToast({ message: "Failed to claim session", type: "error" });
            return false;
        } catch {
            showToast({ message: "Failed to claim session", type: "error" });
            return false;
        } finally {
            setIsClaiming(false);
        }
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationModalOpen(false);
        onClose();
    };

    return (
        <>
            <CenterModal
                isOpen={isOpen && !isConfirmationModalOpen}
                onClose={onClose}
                width={600}
                hideCloseIcon={true}
                headerComponent={
                    <div className="flex items-start justify-between w-full">
                        <h2 className="text-[20px] font-medium text-[#121212] flex-1 pr-2">{session.title}</h2>
                        <TagComponent
                            text={status.label}
                            tagClassName={`${status.bg} ${status.text} !border-none !px-3 !py-1 !text-sm !font-medium`}
                        />
                    </div>
                }
                headerClassName="!px-6 !py-5 !border-0"
                bodyClassName="!px-6 !py-1"
                footerComponent={
                    <div className="w-full flex gap-3 pb-2">
                        <Button
                            title="Close"
                            btnVariant="tertiary"
                            customClassName="!bg-white !text-black !border !border-gray-300 flex-1"
                            onClick={onClose}
                        />
                        <Button
                            title="Claim Now"
                            btnVariant="secondary"
                            customClassName={`flex-1 ${displayNote ? "!bg-[#1E1E1E] !cursor-not-allowed !text-white" : ""}`}
                            onClick={handleClaim}
                            disabled={displayNote || isCheckingValidation}
                        />
                    </div>
                }
                footerClassName="!px-6 !py-4 !border-0"
            >
                <div className="flex flex-col gap-4">
                    {/* Subject Tags */}
                    {session.tags && session.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {session.tags.map((tag, index) => {
                                const label = typeof tag === "string" ? tag : (tag as any)?.skill_name ?? (tag as any)?.name ?? "";
                                if (!label) return null;
                                return (
                                    <TagComponent
                                        key={index}
                                        text={label}
                                        tagClassName="!bg-[#E0F2FE] !border-none !text-black !px-3 !py-1 !text-sm"
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-black leading-relaxed">{session.description}</p>

                    {/* Duration Section */}
                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center pb-1! w-5 h-5 text-gray-600 flex-shrink-0">
                                <TimeIcon className="w-5 h-5" />
                            </div>
                            <span className="text-base font-medium text-[#4F4F4F]">Duration</span>
                        </div>
                        <span className="text-base font-medium text-[#121212]">
                            {session.startTime} - {session.endTime} {session.timezone} ({session.duration})
                        </span>
                    </div>

                    {/* Hosted By Section */}
                    <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 text-gray-600 flex-shrink-0">
                                <HostedByIcon />
                            </div>
                            <span className="text-base font-medium text-[#4F4F4F]">Hosted By</span>
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
                            <span className="text-base font-medium text-[#121212]">{session.instructor.name}</span>
                        </div>
                    </div>

                    {/* Note Section - Show only for the first available session when user has claimed a session */}
                    {session.status === "available" && displayNote && (
                        <div className="bg-[#FEF9C3] rounded-lg p-4 mb-1">
                            <p className="text-sm text-[#A16207] leading-relaxed">
                                <span className="font-semibold text-[#A16207] text-sm">Note:</span> You've already claimed one session. You can claim another starting 30 minutes before the session begins, if it hasn't been claimed by someone else.
                            </p>
                        </div>
                    )}
                </div>
            </CenterModal>

            {/* Confirmation Modal */}
            <ClaimConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmClaim}
                onUnclaim={() => {
                    queryClient.invalidateQueries({ queryKey: ["learner-instant-sessions"] });
                    queryClient.invalidateQueries({ queryKey: ["learner-accepted-instant-sessions"] });
                    onClose();
                }}
                session={session}
                isClaiming={isClaiming}
            />
        </>
    );
};

export default InstantSessionDetailModal;
