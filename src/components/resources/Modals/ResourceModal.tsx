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
import { addResource, getSingleResource, updateResource } from "@/api/resources";
import { showToast } from "@/components/common/Toast";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

type ResourceModalProps = {
    isOpen: boolean;
    mode: ShowModalType;
    onClose: () => void;
    triggerReload: () => void;
};

type FormData = z.infer<typeof ResourceFormSchema>;

const ResourceModal = ({ triggerReload, isOpen, mode = "view", onClose }: ResourceModalProps) => {
    const { learnerName, volunteerName } = useAppStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(ResourceFormSchema),
    });

    const role = Cookies.get("role");
    const [resourceId] = useQueryState("id") || "";
    const [currentMode] = useQueryState("mode");
    const isEditMode = currentMode === "edit";
    const resourceTitle = isEditMode ? "Edit Resource" : "Add new Resource";

    const { data } = useQuery({
        queryKey: ["getSingleResource", resourceId],
        queryFn: async() => {
            const res = await getSingleResource(resourceId || "");
            reset(res)
        },
        enabled: isEditMode && !!resourceId,
    });

    useEffect(() => {
        reset({})
        setValue("created_by", role === "learner" ? learnerName : volunteerName)
    }, [currentMode])

    const handleAddResource = async(data: FormData) => {
        const res = await addResource({...data, created_by: role});
        if (res?.status === 201) {
            onClose();
            reset({});
            showToast({ message: "Resource created" });
            triggerReload();
        } else {
            showToast({ message: "Resource not created", type: "error" });
        }
    }

    const handleEditResource = async(data: FormData) => {
        const res = await updateResource(resourceId || "",{...data});
        if (res?.status === 201) {
            onClose();
            reset({});
            showToast({ message: "Resource updated" });
            triggerReload();
        } else {
            showToast({ message: "Resource not updated", type: "error" });
        }
    }


    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if(isEditMode){
                await handleEditResource(data);
            }else{
                await handleAddResource(data);
            }
        } catch (error) {
            showToast({ message: "An error occurred", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const buttonProps = {
        secondary: {
            onClick: onClose,
            title: "Cancel",
            btnVariant: "secondary" as const,
            customClassName: cn(
                mode === "view"
                    ? "!text-error !bg-error-light !border-none"
                    : "!bg-transparent !text-black",
                "!rounded-xl"
            ),
        },
        primary: {
            onClick: handleSubmit(onSubmit),
            title: isEditMode ? "Edit" : "Add",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        },
    };

    return (
        <CenterModal
            title={resourceTitle}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            loading={isSubmitting}
            customClassName="max-h-[80vh] !rounded-2xl overflow-hidden"
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={{
                ...buttonProps.primary,
                disabled: isSubmitting,
                title: isSubmitting ? (isEditMode ? "Editing" : "Adding") : buttonProps.primary.title,
            }}
        >
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