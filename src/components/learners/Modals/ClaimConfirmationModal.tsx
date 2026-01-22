"use client";

import React, { useState } from "react";
import CenterModal from "@/components/common/Modals/CenterModal";
import Button from "@/components/common/Button";
import ConfirmationSuccessfulModal from "./ConfirmationSuccessfulModal";

interface ClaimConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
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
    session,
}) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleConfirm = () => {
        console.log("Yes Confirm clicked, opening success modal");
        setIsSuccessModalOpen(true);
        // Don't call onConfirm yet - wait until success modal is shown
        // The parent will handle the confirmation logic
    };

    const handleCloseSuccess = () => {
        console.log("Closing success modal");
        setIsSuccessModalOpen(false);
        // Call onConfirm when success modal closes (user has seen the confirmation)
        if (onConfirm) {
            onConfirm();
        }
        onClose(); // Close the confirmation modal after success modal closes
    };

    return (
        <>
        {!isSuccessModalOpen && (
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
                        title="Yes Confirm"
                        btnVariant="secondary"
                        customClassName="flex-1"
                        onClick={handleConfirm}
                    />
                </div>
            }
                footerClassName="!px-6 !py-4 !border-0"
        >
            <div className="flex flex-col gap-4">
                {/* Confirmation Message */}
                    <p className="text-sm text-[#4F4F4F] leading-relaxed">
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
            session={session}
        />
        </>
    );
};

export default ClaimConfirmationModal;
