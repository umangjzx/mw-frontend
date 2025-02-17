import { z } from "zod";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/components/common/Toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FeedHeader from "@/components/community/FeedHeader/index";
import { cn } from "@/utils/merge-class";
import {
    LearnerProfileFormConstants,
    LearnerProfileFormSchema,
    VolunteerProfileFormConstants,
    VolunteerProfileFormSchema,
} from "@/constants/profile";
import { updateLearnerProfile } from "@/api/learners";
import { updateVolunteerProfile } from "@/api/volunteers";

type EditProfileModalProps = {
    data?: any;
    initialFormData?: any;
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
};

const EditProfileModal = ({
    data = {},
    initialFormData = {},
    triggerReload,
    isOpen,
    onClose,
}: EditProfileModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isMobile = useMediaQuery("(max-width: 767px)");

    const role = Cookies.get("role");
    const isVolunteer = role === "volunteer";

    const UserProfileFormConstants = useMemo(
        () => (isVolunteer ? VolunteerProfileFormConstants : LearnerProfileFormConstants),
        [isVolunteer]
    );

    const UserProfileFormSchema = useMemo(
        () => (isVolunteer ? VolunteerProfileFormSchema : LearnerProfileFormSchema),
        [isVolunteer]
    );

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
        if (isOpen) reset(initialFormData);
    }, [isOpen, reset, initialFormData]);

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const updateProfile = isVolunteer ? updateVolunteerProfile : updateLearnerProfile;
            const status = await updateProfile(initialFormData?.userId || "", data, formData);

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

    const onError = () => {
        showToast({ message: "Please enter all details.", type: "error" });
    };

    const buttonProps = {
        secondary: {
            onClick: onClose,
            title: "Cancel",
            btnVariant: "secondary",
            customClassName: cn("!bg-transparent !text-black !rounded-xl sm:w-auto w-[72px]"),
            disabled: isSubmitting,
        },
        primary: {
            onClick: handleSubmit(onSubmit, onError),
            title: isSubmitting ? "Saving" : "Save",
            customClassName: cn("!rounded-xl hover:!bg-black hover:!text-white sm:w-auto w-[72px]"),
            disabled: isSubmitting,
        },
    };

    const formFields = UserProfileFormConstants.map((field: any) => (
        <Controller
            key={field?.name}
            name={field?.name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <Input
                    {...field}
                    error={errors[field?.name as keyof FormData]?.message}
                    value={value}
                    onChange={onChange}
                    rootClassName="max-md:bg-white max-md:p-4 max-md:rounded-xl"
                    inputClassName={field?.inputClassName}
                    labelClassName="[&_.inner-label]:!font-semibold [&_.inner-label]:!text-sm"
                />
            )}
        />
    ));

    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            loading={isSubmitting}
            hideFooter={isMobile}
            hideCloseIcon={isMobile}
            height={isMobile ? "100vh" : "auto"}
            width={isMobile ? "100vw" : 800}
            headerComponent={isMobile && (
                <FeedHeader
                    title="Edit Profile"
                    mode="edit"
                    onClose={onClose}
                    onSave={handleSubmit(onSubmit, onError)}
                    isSubmitting={isSubmitting}
                    rootClassName="w-full !mb-0 sticky top-0 bg-white z-10 !p-0"
                />
            )}
            secondaryActionProps={buttonProps.secondary}
            primaryActionProps={buttonProps.primary}
            rootClassName="md:max-h-[80vh]"
            bodyClassName="max-md:!bg-background-input"
        >
            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className={cn("flex flex-col gap-2 md:gap-4", isMobile && "px-2 py-3 overflow-auto")}
            >
                {formFields}
            </form>
        </CenterModal>
    );
};

export default EditProfileModal;