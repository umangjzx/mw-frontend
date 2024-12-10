import DetailsSection from "@/components/common/DetailsSection";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { LearnerFeedbackFormConstants } from "@/constants/schedule";
import { cn } from "@/utils/merge-class";

const FeedbackModal = ({ isOpen, mode = "view" }: FeedbackModalProps) => {
    const feedbackTitle = mode === "edit" ? "Edit Feedback" : "Please Fill the Feedback";
    const details = {
        Name: "John Doe",
        Phone: "+1234567890",
        Address: "1234 ",
    };

    const handleSubmit = () => {
        console.log("Proceed");
    };

    const handleCancel = () => {};


   const buttonProps = {
    primary: {
        onClick: handleSubmit,
        title: mode === "view" ? "Edit" : "Submit",
        customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
    },
    secondary: {
        onClick: handleCancel,
        title: mode === "view" ? "Delete" : "Cancel",
        btnVariant: "secondary" as const,
        customClassName: cn(
            mode === "view" ? "!text-error !bg-error-light !border-none" : "!bg-transparent !text-black",
            "!rounded-xl"
        ),
    }
   }

    return (
        <CenterModal
            title={feedbackTitle}
            isOpen={isOpen}
            onClose={handleCancel}
            topContent={<DetailsSection data={details} />}
            width='40%'
            customClassName='max-h-[80vh] !rounded-2xl overflow-hidden'
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
        >
            {mode !== "view" ? (
                LearnerFeedbackFormConstants.map((field: any) => (
                    <Input key={field.name} {...field} onChange={() => {}} />
                ))
            ) : (
                <div>View</div>
            )}
        </CenterModal>
    );
};

export default FeedbackModal;
