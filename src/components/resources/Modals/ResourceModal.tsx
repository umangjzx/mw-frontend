import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { ResourceFormConstants, ResourceFormSchema } from "@/constants/resources";
import { cn } from "@/utils/merge-class";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/store/useAppStore";
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

type ResourceActionProps = {
    data: FormData;
    actionFn: (data: FormData) => Promise<any>;
    successMessage: string;
    errorMessage: string;
};

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

    // Fetch resource data if in edit mode
    useQuery({
        queryKey: ["getSingleResource", resourceId],
        queryFn: async () => {
            const resource = await getSingleResource(resourceId || "");
            reset(resource);
        },
        enabled: isEditMode && !!resourceId,
    });

    useEffect(() => {
        reset({});
        setValue("created_by", role === "learner" ? learnerName : volunteerName);
    }, [currentMode]);

    const handleResourceAction = async ({ data, actionFn, successMessage, errorMessage }: ResourceActionProps) => {
        setIsSubmitting(true);
        try {
            const isSuccess = await actionFn(data);
            if (isSuccess) {
                showToast({ message: successMessage });
                triggerReload();
                onClose();
                reset({});
            } else {
                showToast({ message: errorMessage, type: "error" });
            }
        } catch (error) {
            showToast({ message: "Something went wrong!", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = (data: FormData) => {
        const actionFn = isEditMode
            ? (d: FormData) => updateResource(resourceId || "", d)
            : (d: FormData) => addResource({ ...d, created_by: role });
        const successMessage = isEditMode ? "Resource updated" : "Resource created";
        const errorMessage = isEditMode ? "Resource not updated" : "Resource not created";

        handleResourceAction({ data, actionFn, successMessage, errorMessage });
    };

    const buttonProps = {
        secondary: {
            onClick: onClose,
            title: "Cancel",
            btnVariant: "secondary",
            customClassName: cn(
                mode === "view"
                    ? "!text-error !bg-error-light !border-none"
                    : "!bg-transparent !text-black",
                "!rounded-xl"
            ),
        },
        primary: {
            onClick: handleSubmit(onSubmit),
            title: isSubmitting ? (isEditMode ? "Saving" : "Adding") : isEditMode ? "Save" : "Add",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            disabled: isSubmitting,
        },
    };

    return (
        <CenterModal
            title={isEditMode ? "Edit Resource" : "Add New Resource"}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            loading={isSubmitting}
            customClassName="max-h-[80vh] !rounded-2xl overflow-hidden"
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
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