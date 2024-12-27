import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { ResourceFormConstants, ResourceFormSchema } from "@/constants/resources";
import { cn } from "@/utils/merge-class";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/store/useAppStore"
import { addResource } from "@/api/resources";
import { showToast } from "@/components/common/Toast";

type ResourceModalProps = {
    isOpen: boolean;
    mode: ShowModalType;
    onClose: () => void;
};

type FormData = z.infer<typeof ResourceFormSchema>;

const ResourceModal = ({ isOpen, mode = "view", onClose }: ResourceModalProps) => {
    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(ResourceFormSchema),
    });

    const { learnerName, volunteerName } = useAppStore();
    useEffect(()=>{
        setValue("created_by", learnerName || volunteerName)
    }, [])

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const role = Cookies.get("role");
    const resourceTitle = mode === "edit" ? "Edit Resource" : "Add new Resource";

    const onSubmit = async (data: FormData) => {
        const payload = {
            resource_title: data?.resource_title,
            resource_description: data?.resource_description,
            resource_skills:
                data?.resource_skills?.map((skill) => ({
                    skill_id: "81b8cfbd-1910-4fae-a4fc-14c89987eb07",
                    skill_name: "Music theory", // Adjust as needed
                })) || [],
            resource_category: {
                category_name: data?.resource_category?.category_name,
                category_id: data?.resource_category?.category_id,
            },
            resource_notes: data?.resource_notes,
            difficulty_level: data?.difficulty_level,
            created_by: role,
            resource_image: data?.resource_image
                ? {
                      image_url: data?.resource_image.image_url,
                      image_id: data?.resource_image.image_id,
                  }
                : null,
        };
        
        const res = await addResource(payload);
        if(res?.status === 201) {
            onClose()
            showToast({ message: "Resource created" })
        }else{
            showToast({ message: "Resource not created", type: "error" })
        }
    };

    const buttonProps = {
        primary: {
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
            onClick: handleSubmit(onSubmit),
            title: mode === "view" ? "Edit" : "Submit",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        },
    };

    return (
        <CenterModal
            title={resourceTitle}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            customClassName="max-h-[80vh] !rounded-2xl overflow-hidden"
            secondaryActionProps={{
                ...buttonProps.secondary,
                disabled: isSubmitting,
                title: isSubmitting ? "Submitting..." : buttonProps.secondary.title,
            }}
            primaryActionProps={buttonProps.primary}
        >
            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
            {mode !== "view" ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {ResourceFormConstants.map((field: any) => (
                        <Controller
                            key={field.name}
                            name={field.name}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    key={field.name}
                                    {...field}
                                    error={errors[field.name as keyof FormData]?.message}
                                    value={value}
                                    onChange={onChange}
                                    inputClassName={field.inputClassName}
                                />
                            )}
                        />
                    ))}
                </form>
            ) : (
                <div>View</div>
            )}
        </CenterModal>
    );
};

export default ResourceModal;