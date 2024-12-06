import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { LearnerProfileFormConstants } from "@/constants/profile";
import { useState } from "react";

type ProfileModalProps = {
    isOpen: boolean;
};

const ProfileModal = ({ isOpen }: ProfileModalProps) => {
    const [formData, setFormData] = useState<any>({});

    const handleChange = (key: string, value: string | number | boolean | null | undefined) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        console.log("Proceed");
    };

    const handleCancel = () => {};

    const buttonProps = {
        primary: {
            onClick: handleCancel,
            title: "Cancel",
            btnVariant: "secondary" as const,
            customClassName: "!bg-transparent !text-black !rounded-xl",
        },
        secondary: {
            onClick: handleSubmit,
            title: "Save",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        },
    };

    return (
        <CenterModal
            title={"Edit Profile"}
            isOpen={isOpen}
            onClose={handleCancel}
            width='40%'
            customClassName='max-h-[80vh] !rounded-2xl overflow-hidden'
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
        >
            {LearnerProfileFormConstants.map((field: any) => (
                <Input
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    onChange={(value: any) => handleChange(field.name, value)}
                />
            ))}
        </CenterModal>
    );
};

export default ProfileModal;
