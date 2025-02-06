import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { cn } from "@/utils/merge-class";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/store/useAppStore";
import { getSingleResource, updateResource } from "@/api/resources";
import { showToast } from "@/components/common/Toast";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FeedHeader from "@/components/community/FeedHeader/index";
import { VolunteerProfileFormConstants, VolunteerProfileFormSchema } from "@/constants/profile";
import { PUT_API } from "@/api/request";
import { endpoints } from "@/api/constants";

type EditProfileModalProps = {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
};

type FormData = z.infer<typeof VolunteerProfileFormSchema>;

const EditProfileModal = ({ data = {}, triggerReload, isOpen, onClose }: EditProfileModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(VolunteerProfileFormSchema),
    });

    console.log("Errors: ", errors);
    console.log("Data: ", data);

    const role = Cookies.get("role");
    const [currentMode] = useQueryState("mode");

    useEffect(() => {
        reset(data);
    }, [currentMode])

    useEffect(() => {
        reset({});
    }, [currentMode]);

    const onSubmit = async(formData: FormData) => {
        setIsSubmitting(true);
        try {
            const endpoint = role === "volunteer" ? endpoints.volunteer.update(data?.userId || "") : endpoints.learner.update(data?.userId || "");
            const { status } = await PUT_API(endpoint, formData);
            if (status === 201) {
                showToast({ message: "Profile updated" });
                triggerReload();
                onClose();
                reset({});
            } else {
                showToast({ message: "Profile not updated", type: "error" });
            }
        } catch (error) {
            showToast({ message: "Something went wrong!", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const buttonProps = {
        secondary: {
            onClick: onClose,
            title: "Cancel",
            btnVariant: "secondary",
            customClassName: cn(
                "!bg-transparent !text-black",
                "!rounded-xl",
                "sm:w-auto w-[72px]"
            ),
            disabled: isSubmitting,
        },
        primary: {
            onClick: handleSubmit(onSubmit),
            title: isSubmitting ? "Saving" : "Save",
            customClassName: cn(
                "!rounded-xl hover:!bg-black hover:!text-white",
                "sm:w-auto w-[72px]"
            ),
            disabled: isSubmitting,
        },
    };

    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <CenterModal
            title={"Edit Profile"}
            isOpen={isOpen}
            onClose={onClose}
            loading={isSubmitting}
            width={800}
            headerComponent={
                isMobile && (
                    <FeedHeader
                        title="Edit Profile"
                        onClose={onClose}
                        onSave={handleSubmit(onSubmit)}
                        isSubmitting={isSubmitting}
                    />
                )
            }
            customClassName={cn(
                "sm:max-h-screen overflow-hidden",
                isMobile
                    ? "[&_.ant-modal-content]:!p-0 !p-0 !m-0 !h-[100dvh] !max-h-none !w-screen !max-w-none rounded-none"
                    : "!rounded-2xl"
            )}
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
            hideFooter={isMobile}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(
                    "flex flex-col gap-1",
                    isMobile && "px-4 pb-4"
                )}
            >
                {VolunteerProfileFormConstants.map((field: any) => (
                    <Controller
                        key={field?.name}
                        name={field?.name}
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
        </CenterModal>
    );
};

export default EditProfileModal;