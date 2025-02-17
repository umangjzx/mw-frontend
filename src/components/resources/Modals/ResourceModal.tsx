import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { ResourceFormConstants, ResourceFormDefaultValues, ResourceFormSchema } from "@/constants/resources";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FeedHeader from "@/components/community/FeedHeader/index";
import LottieLoader from "@/components/common/Loader/Lottie";

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

    const role = Cookies.get("role");
    const [resourceId] = useQueryState("id") || "";
    const [currentMode] = useQueryState("mode");
    const isEditMode = currentMode === "edit";

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(ResourceFormSchema),
    });
    
    // Fetch resource data if in edit mode
    const { isFetching } = useQuery({
        queryKey: ["getSingleResource", resourceId],
        queryFn: async () => {
            if(!resourceId) return null;
            const resource = await getSingleResource(resourceId || "");
            reset(resource);
        },
        enabled: isEditMode && !!resourceId,
    });

    useEffect(() => {
        setValue("created_by", role === "learner" ? learnerName : volunteerName);
    }, [currentMode, resourceId]);

    useEffect(() => {
        if (currentMode === "create") {
            reset({...ResourceFormDefaultValues});
        }
    }, [currentMode, reset]);

    const handleResourceAction = async ({
        data,
        actionFn,
        successMessage,
        errorMessage,
    }: ResourceActionProps) => {
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

    const onError = () => {
        showToast({ message: "Please enter all details.", type: "error" });
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
                "!rounded-xl",
                "sm:w-auto w-[72px]"
            ),
        },
        primary: {
            onClick: handleSubmit(onSubmit, onError),
            title: isSubmitting ? (isEditMode ? "Saving" : "Adding") : isEditMode ? "Save" : "Add",
            customClassName: cn(
                "!rounded-xl hover:!bg-black hover:!text-white",
                "sm:w-auto w-[72px]"
            ),
            disabled: isSubmitting,
        },
    };

    const isMobile = useMediaQuery("(max-width: 767px)");

    return (
        <CenterModal
            title={isEditMode ? "Edit Resource" : "Add New Resource"}
            isOpen={isOpen}
            onClose={onClose}
            loading={isSubmitting}
            width={600}
            headerComponent={
                isMobile && (
                    <FeedHeader
                        mode={currentMode || ""}
                        title={isEditMode ? "Edit Resource" : "Add New Resource"}
                        rootClassName="!w-full !p-1"
                        onClose={onClose}
                        onSave={handleSubmit(onSubmit, onError)}
                        isSubmitting={isSubmitting}
                    />
                )
            }
            hideCloseIcon={isMobile}
            rootClassName="md:!h-auto md:!max-h-[70dvh]"
            bodyClassName="max-md:!bg-background-input"
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
            hideFooter={isMobile}
        >
            {mode !== "view" ? (
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className={cn(
                        "flex flex-col gap-2 md:gap-4 py-3",
                        isMobile && "overflow-y-auto px-4 pt-2"
                    )}
                >
                    {
                        isEditMode && isFetching ? (
                            <div className={`w-full flex-center ${isMobile ? "min-h-[90vh]" : "min-h-[45vh]"}`}>
                                <LottieLoader isLoading={true} customClassName="md:w-[5rem] md:h-[5rem] lg:w-[6rem] lg:h-[6rem]" />
                            </div>
                        ) : ResourceFormConstants.map((field: any) => (
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
                                        rootClassName="max-md:bg-white max-md:p-4 max-md:rounded-xl"
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
