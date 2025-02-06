import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";

import { cn } from "@/utils/merge-class";
import { useEffect, useState } from "react";

import { showToast } from "@/components/common/Toast";
import { Radio } from "antd";
import { POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";

type CommunityReportModalProps = {
    isOpen: boolean;
    postId: string;
    onClose: () => void;
};

const options = [
    { label: "Inappropriate Content", value: "inappropriate_content" },
    { label: "Spam or Advertising", value: "spam_or_advertising" },
    { label: "Misinformation", value: "misinformation" },
    { label: "Others", value: "others" },
];

const CommunityReportModal = ({ postId, isOpen, onClose }: CommunityReportModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [reportType, setReportType] = useState<string>("");
    const [reportDescription, setReportDescription] = useState<string>("");

    useEffect(() => {
        setReportDescription("");
        setReportType("");
    }, [isOpen]);

    const handleSubmit = async () => {
        let message = "";

        if (!reportType) message = "Please, select the report";
        if (reportType === "others" && !reportDescription) message = "Description is required";
        if (!postId) message = "Post ID is missing";

        if (message) {
            showToast({ type: "error", message: message });
            return;
        }

        setIsSubmitting(true);
        const payload = {
            resource_type_id: postId,
            report_type: "post",
            report_description: reportDescription,
        };

        try {
            const { status } = await POST_API(endpoints.report.create, payload);
            const isSuccess = status === 201;
            showToast({
                type: isSuccess ? "success" : "error",
                message: isSuccess ? "Report Submitted!" : "Report Not Submitted!",
            });

            if (isSuccess) onClose();
        } catch (error) {
            showToast({ type: "error", message: "Something went wrong!" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const buttonProps = {
        secondary: {
            onClick: onClose,
            title: "Cancel",
            btnVariant: "secondary",
            customClassName: cn("!bg-transparent !text-black", "!rounded-xl"),
        },
        primary: {
            onClick: handleSubmit,
            title: isSubmitting ? "Submiting Report" : "Submit Report",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            disabled: isSubmitting,
        },
    };

    return (
        <CenterModal
            title={"Why do you want to report this resource?"}
            zIndex={2000}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            loading={isSubmitting}
            customClassName="md:max-h-[80vh] !rounded-2xl overflow-hidden !z-[2000] "
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
        >
            <p className="text-base mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
            </p>
            <div>
                <Radio.Group
                    name="report_type"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full"
                >
                    <div className="flex flex-col items-center gap-2 ">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`flex w-full items-center hover:bg-background-input bg-background-input p-2 rounded-lg border ${
                                    reportType === option.value && "border-black"
                                }`}
                            >
                                <Radio className="w-full" value={option.value}>
                                    <div>
                                        <span>{option.label}</span>
                                    </div>
                                </Radio>
                            </div>
                        ))}
                    </div>
                </Radio.Group>
                {reportType === "others" && (
                    <Input
                        name="description"
                        inputType="textarea"
                        value={reportDescription}
                        inputClassName="mt-5"
                        placeholder="Please tell us the details"
                        onChange={(event) => setReportDescription(event)}
                    />
                )}
            </div>
        </CenterModal>
    );
};

export default CommunityReportModal;
