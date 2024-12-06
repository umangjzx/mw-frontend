import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { MessageModalConstants } from "@/constants/volunteer";

type MessageModalProps = {
    isOpen: boolean;
};

const MessageModal = ({ isOpen }: MessageModalProps) => {

    const handleSubmit = () => {
        console.log("Proceed");
    };

    const handleCancel = () => {};

    return (
        <CenterModal
            title={"Send a Message"}
            isOpen={isOpen}
            onClose={handleCancel}
            width='40%'
            customClassName='max-h-[80vh] text-primary font-semibold !rounded-2xl overflow-hidden'
            secondaryActionProps={{
                onClick: handleSubmit,
                title: "Send Email",
                customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            }}
            primaryActionProps={{
                onClick: handleCancel,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: "!bg-transparent !text-black !rounded-xl",
            }}
        >
            {MessageModalConstants.map((field: any) => (
                <Input key={field.name} {...field} onChange={() => {}} />
            ))}
        </CenterModal>
    );
};

export default MessageModal;
