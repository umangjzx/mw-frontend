import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { LearnerCommunityFormConstants } from "@/constants/community";
import { cn } from "@/utils/merge-class";

type PostModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const PostModal = ({ isOpen, onClose }: PostModalProps) => {
    const handleSubmit = () => {
        console.log("Proceed");
    };

    return (
        <CenterModal
            title={"Add new post"}
            isOpen={isOpen}
            onClose={onClose}
            width='40%'
            customClassName='max-h-[80vh] !rounded-2xl overflow-hidden'
            secondaryActionProps={{
                onClick: handleSubmit,
                title: "Share now",
                customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            }}
            primaryActionProps={{
                onClick: onClose,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: cn("!bg-transparent !text-black", "!rounded-xl"),
            }}
        >
            {LearnerCommunityFormConstants.map((field: any) => (
                <Input key={field.name} {...field} onChange={() => {}} />
            ))}
        </CenterModal>
    );
};

export default PostModal;
