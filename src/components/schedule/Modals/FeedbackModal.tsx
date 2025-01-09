"use client";

import DetailsSection from "@/components/common/DetailsSection";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { LearnerFeedbackFormConstants } from "@/constants/schedule";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/merge-class";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const FeedbackModal = ({
    isOpen,
    mode = "view",
    onClose,
    onSubmit,
    data,
    Loading,
}: FeedbackModalProps) => {
    const [formData, setFormData] = useState<any>({});
    const { learnerName, volunteerName } = useAppStore();
    const feedbackTitle = mode === "edit" ? "Edit Feedback" : "Please Fill the Feedback";
    const searchParams = useSearchParams();
    const role = Cookies.get("role");

    const eventDetails = {
        Name: role === "volunteer" ? volunteerName : learnerName,
        Date: new Date().toLocaleDateString("en-GB"),
        Time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }),
    };

    const [extendedData, setExtendedData] = useState<any>([]);
    console.log(extendedData, "extendedData for feedback");

    useEffect(() => {
        if (data) {
            setExtendedData(data?._def?.extendedProps);
        }
    }, [data]);

    const handleSubmit = () => {
        const submissionData = {
            ...formData,
            image: [
                {
                    image_url: "",
                    image_id: "",
                },
            ],
        };
        onSubmit(submissionData);
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const buttonProps = {
        primary: {
            onClick: handleSubmit,
            title: mode === "view" ? "Edit" : "Submit",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        },
        secondary: {
            onClick: onClose,
            title: mode === "view" ? "Delete" : "Cancel",
            btnVariant: "secondary" as const,
            customClassName: cn(
                mode === "view"
                    ? "!text-error !bg-error-light !border-none"
                    : "!bg-transparent !text-black",
                "!rounded-xl"
            ),
        },
    };

    return (
        <CenterModal
            title={feedbackTitle}
            isOpen={isOpen}
            onClose={onClose}
            topContent={<DetailsSection data={eventDetails} />}
            width="40%"
            customClassName="max-h-[80vh] !rounded-2xl overflow-hidden"
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
            loading={Loading}
        >
            {mode !== "view" ? (
                LearnerFeedbackFormConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...field}
                        value={formData[field.name]}
                        onChange={(value: any) => handleChange(field.name, value)}
                    />
                ))
            ) : (
                <div>View</div>
            )}
        </CenterModal>
    );
};

export default FeedbackModal;
