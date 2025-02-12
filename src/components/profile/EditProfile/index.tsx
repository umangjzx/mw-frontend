import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { cn } from "@/utils/merge-class";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/components/common/Toast";
import { useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FeedHeader from "@/components/community/FeedHeader/index";
import { LearnerProfileFormConstants, LearnerProfileFormSchema, VolunteerProfileFormConstants, VolunteerProfileFormSchema } from "@/constants/profile";
import { PUT_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { updateLearnerProfile } from "@/api/learners";

type EditProfileModalProps = {
    data?: any;
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
};


const EditProfileModal = ({ data = {}, triggerReload, isOpen, onClose }: EditProfileModalProps) => {
    const [currentMode] = useQueryState("mode");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const role = Cookies.get("role");
    const isVolunteer = role === "volunteer";

    const UserProfileFormConstants = isVolunteer ? VolunteerProfileFormConstants : LearnerProfileFormConstants;
    const UserProfileFormSchema = isVolunteer ? VolunteerProfileFormSchema : LearnerProfileFormSchema;

    type FormData = z.infer<typeof UserProfileFormSchema>;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(UserProfileFormSchema),
    });

    useEffect(() => {
        reset(data);
    }, [data])

    console.log("Errors:", errors);

    const onSubmit = async (formData: FormData) => {
        console.log("Form Data to submit:", formData);
        setIsSubmitting(true);
        try {
            const status = isVolunteer ? await updateLearnerProfile(data?.userId || "", formData) : await updateLearnerProfile(data?.userId || "", formData);
            if (status === 201) {
                showToast({ message: "Profile updated" });
                triggerReload();
                onClose();
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

    const isMobile = useMediaQuery("(max-width: 767px)");

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
                        rootClassName="!mb-0"
                    />
                )
            }
            rootClassName="md:h-full [&_.modal-body]:md:max-h-[60dvh]"
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
                    "flex flex-col gap-2 md:gap-4",
                    isMobile && "px-4 pb-4"
                )}
            >
                {UserProfileFormConstants.map((field: any) => (
                    <Controller
                        key={field?.name}
                        name={field?.name}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                key={field?.name}
                                {...field}
                                error={errors[field.name as keyof FormData]?.message}
                                value={value}
                                onChange={onChange}
                                rootClassName={"max-md:bg-white max-md:p-4 max-md:rounded-xl"}
                                inputClassName={field?.inputClassName}
                                labelClassName="[&_.inner-label]:!font-semibold [&_.inner-label]:!text-sm"
                            />
                        )}
                    />
                ))}
            </form>
        </CenterModal>
    );
};

export default EditProfileModal;