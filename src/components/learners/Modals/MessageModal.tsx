import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { MessageModalConstants } from "@/constants/volunteer";

type MessageModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const MessageModal = ({ isOpen, onClose }: MessageModalProps) => {
    const handleSubmit = () => {
        console.log("Proceed");
    };

    return (
        <CenterModal
            title={"Send a Message"}
            isOpen={isOpen}
            onClose={onClose}
            width='40%'
            customClassName='max-h-[80vh] text-primary font-semibold !rounded-2xl overflow-hidden'
            secondaryActionProps={{
                onClick: handleSubmit,
                title: "Send Email",
                customClassName: "!rounded-xl hover:!bg-black text-sm hover:!text-white",
            }}
            primaryActionProps={{
                onClick: onClose,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: "!bg-transparent !text-black text-sm !rounded-xl",
            }}
        >
            {MessageModalConstants.map((field: any) => (
                <Input key={field.name} {...field} onChange={() => {}} />
            ))}
        </CenterModal>
    );
};

export default MessageModal;
