"use client";

import React, { useState, useEffect } from "react";
import CenterModal from "@/components/common/Modals/CenterModal";
import Button from "@/components/common/Button";
import ConfirmationSuccessfulModal from "./ConfirmationSuccessfulModal";
import { GET_API, DELETE_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import moment from "moment";
import { showToast } from "@/components/common/Toast";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

interface ClaimConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<boolean | void>;
    onUnclaim?: () => void;
    isClaiming?: boolean;
    /** Called with true/false to control the full-screen loader */
    onClaimLoadingChange?: (loading: boolean) => void;
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
        instructor: {
            name: string;
            profilePicture?: string;
        };
        meetingLink?: string;
        guests?: string[];
    };
}

const ClaimConfirmationModal: React.FC<ClaimConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onUnclaim,
    session,
    isClaiming = false,
    onClaimLoadingChange,
}) => {
    const queryClient = useQueryClient();
    const today = dayjs().format("YYYY-MM-DD");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successSession, setSuccessSession] = useState<any>(session);
    const [showConfirmation, setShowConfirmation] = useState(true);

    // Reset confirmation state when modal opens
    useEffect(() => {
        if (isOpen) {
            setShowConfirmation(true);
            setIsSuccessModalOpen(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        // Close confirmation modal immediately before showing loader
        setShowConfirmation(false);
        
        try {
            const success = await onConfirm?.();
            if (success === true) {
                try {
                    // Keep loader showing while fetching session details
                    // Fetch the latest session details
                    const response = await GET_API(endpoints.session.getLearnerInstantSessionDetail(session.id));
                    const apiData = response.data;

                    if (apiData) {
                        const formattedSession = {
                            id: apiData.volunteer_slot_id,
                            title: apiData.title,
                            startTime: moment(apiData.start_time, "HH:mm").format("h:mm a"),
                            endTime: moment(apiData.end_time, "HH:mm").format("h:mm a"),
                            timezone: (apiData.volunteer_timezone || session.timezone)?.split(" - ")[0], // Fallback if missing
                            duration: `${apiData.duration} Mins`,
                            instructor: {
                                name: apiData.volunteer_name,
                                profilePicture: apiData.volunteer_image?.image_url || "/dummy-profile.webp",
                            },
                            meetingLink: apiData.meet_link,
                            guests: [apiData.volunteer_email, apiData.learner_email],
                        };
                        setSuccessSession(formattedSession);
                    }
                } catch (error) {
                    console.error("Failed to fetch session details:", error);
                    // Fallback to original session if fetch fails
                    setSuccessSession(session);
                } finally {
                    // Hide loader after session details are fetched (or failed)
                    onClaimLoadingChange?.(false);
                }
                setIsSuccessModalOpen(true);
            } else {
                // Hide loader if claim failed
                onClaimLoadingChange?.(false);
            }
        } catch {
            // Hide loader on error
            onClaimLoadingChange?.(false);
            // Parent shows toast on error
        }
    };

    const handleCloseSuccess = () => {
        setIsSuccessModalOpen(false);
        onClose();
    };

    const handleCancelSession = async () => {
        if (!successSession?.id) return;

        // Show loader
        onClaimLoadingChange?.(true);

        try {
            const res = await DELETE_API(endpoints.session.unclaimInstantSession(successSession.id));
            if (res.status === 200 || res.status === 201) {
                showToast({ message: "Session unclaimed successfully", type: "success" });
                
                // Invalidate queries first
                queryClient.invalidateQueries({ queryKey: ["learner-instant-sessions"] });
                queryClient.invalidateQueries({ queryKey: ["learner-accepted-instant-sessions"] });
                
                // Wait for queries to refetch before hiding loader
                await Promise.all([
                    queryClient.refetchQueries({ queryKey: ["learner-instant-sessions", today] }),
                    queryClient.refetchQueries({ queryKey: ["learner-accepted-instant-sessions", today] }),
                ]);
                
                onUnclaim?.();
                // Modal already closed by ConfirmationSuccessfulModal, just ensure state is updated
                setIsSuccessModalOpen(false);
            } else {
                showToast({ message: "Failed to unclaim session", type: "error" });
            }
        } catch (error) {
            console.error("Error unclaiming session:", error);
            showToast({ message: "Failed to unclaim session", type: "error" });
        } finally {
            // Hide loader after all API calls complete
            onClaimLoadingChange?.(false);
        }
    };

    return (
        <>
            {!isSuccessModalOpen && showConfirmation && (
                <CenterModal
                    isOpen={isOpen}
                    onClose={onClose}
                    width={520}
                    hideCloseIcon={true}
                    headerComponent={
                        <h2 className="text-[20px]] font-medium text-[#121212]">Confirmation</h2>
                    }
                    headerClassName="!px-6 !py-5 !border-0 !justify-start"
                    bodyClassName="!px-6 !py-3"
                    footerComponent={
                        <div className="w-full flex gap-3 pb-2">
                            <Button
                                title="Cancel"
                                btnVariant="tertiary"
                                customClassName="!bg-white !text-black !border !border-gray-300 flex-1"
                                onClick={onClose}
                            />
                            <Button
                                title={isClaiming ? "Claiming..." : "Yes Confirm"}
                                btnVariant="secondary"
                                customClassName="flex-1"
                                onClick={handleConfirm}
                                disabled={isClaiming}
                            />
                        </div>
                    }
                    footerClassName="!px-6 !py-4 !border-0"
                >
                    <div className="flex flex-col gap-4">
                        {/* Confirmation Message */}
                        <p className="text-sm text-[#4F4F4F] leading-relaxed ">
                            Please confirm if you want to claim the "<span className="text-[#121212]">{session.title}</span>" session hosted by <span className="text-[#121212]">{session.instructor.name}</span>, scheduled from <span className="text-[#121212]">{session.startTime} to {session.endTime}</span>.
                        </p>

                        {/* Note Section */}
                        <div className="bg-[#E0F2FE] rounded-lg p-4">
                            <p className="text-sm text-[#4F4F4F] leading-relaxed">
                                <span className="font-medium text-[#121212] ">Note:</span> The appointment, including the meeting link, will be added to your calendar once it's confirmed.
                            </p>
                        </div>
                    </div>
                </CenterModal>
            )}

            {/* Success Modal - Always render, controlled by isOpen prop */}
            <ConfirmationSuccessfulModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccess}
                session={successSession}
                onCancelMeeting={handleCancelSession}
            />
        </>
    );
};

export default ClaimConfirmationModal;
