import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { ResourceFormConstants } from "@/constants/resources";
import { cn } from "@/utils/merge-class";
import { useState } from "react";

type ResourceModalProps = {
    isOpen: boolean;
    mode: ShowModalType;
    onClose: () => void;
};

const ResourceModal = ({ isOpen, mode = "view", onClose }: ResourceModalProps) => {
    const [formData, setFormData] = useState<any>({});

    const resourceTitle = mode === "edit" ? "Edit Resource" : "Add new Resource";

    const handleSubmit = () => {
        console.log("Proceed");
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };


    const buttonProps = {
        primary:{
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
        secondary: {
            onClick: handleSubmit,
            title: mode === "view" ? "Edit" : "Submit",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        }
    };

    return (
        <CenterModal
            title={resourceTitle}
            isOpen={isOpen}
            onClose={onClose}
            width='40%'
            customClassName='max-h-[80vh] !rounded-2xl overflow-hidden'
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
        >
            {mode !== "view" ? (
                ResourceFormConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...field}
                        inputClassName={field.inputClassName}
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

export default ResourceModal;
