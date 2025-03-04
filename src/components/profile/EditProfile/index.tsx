import { z } from "zod";
import CenterModal from "@/components/common/Modals/CenterModal";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/components/common/Toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FeedHeader from "@/components/community/FeedHeader/index";
import { cn } from "@/utils/merge-class";

import { updateLearnerProfile } from "@/api/learners";
import { updateVolunteerProfile } from "@/api/volunteers";
import FormTabsSection from "./FormSection";
import { learnerFormSchema, volunteerFormSchema } from "@/components/onboarding/FormSection/config";
import { LearnerProfileFormSections } from "@/constants/learner";
import { VolunteerProfileFormConstants } from "@/constants/volunteer";

type EditProfileModalProps = {
    data?: any;
    initialFormData?: any;
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
};

const EditProfileModal = ({
    data = {},
    triggerReload,
    isOpen,
    onClose,
}: EditProfileModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isMobile = useMediaQuery("(max-width: 767px)");

    const role = Cookies.get("role");
    const isVolunteer = role === "volunteer";
    const userId = isVolunteer ? Cookies.get("volunteer_id") : Cookies.get("learner_id");

    const UserProfileFormConstants = isVolunteer ? VolunteerProfileFormConstants : LearnerProfileFormSections;
    const UserProfileFormSchema = isVolunteer ? volunteerFormSchema : learnerFormSchema;

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        trigger,
        setError,
        setValue,
    } = useForm<z.infer<typeof UserProfileFormSchema>>({
        resolver: zodResolver(UserProfileFormSchema),
    });
    type FormData = z.infer<typeof UserProfileFormSchema>;

    const validateForm = () => isValid || showToast({ type: "error", message: "Fill required fields!" });

    useEffect(() => {
        if (isOpen) reset(data);
    }, [isOpen, reset, data]);

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const updateProfile = isVolunteer ? updateVolunteerProfile : updateLearnerProfile;
            const status = await updateProfile(userId || "", formData);

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
    
    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            loading={isSubmitting}
            hideFooter={isMobile}
            hideCloseIcon={isMobile}
            height={isMobile ? "100vh" : "auto"}
            width={isMobile ? "100vw" : 680}
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
            rootClassName="md:h-[90vh]"
            bodyClassName="max-md:!bg-background-input !py-0"
        >
            <FormTabsSection 
                formData={UserProfileFormConstants} 
                control={control}
                errors={errors}
                trigger={trigger}
                validateForm={validateForm}
                setValue={setValue}
                onSubmit={handleSubmit(onSubmit, onError)}
                isLoading={isSubmitting}
                setError={setError}
            />
        </CenterModal>
    );
};

export default EditProfileModal;