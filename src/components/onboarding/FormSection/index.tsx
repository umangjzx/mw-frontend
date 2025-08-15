"use client";

import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { showToast } from "@/components/common/Toast";
import { defaultLearnerData, defaultVolunteerData } from "./config";
import FormTabs from "./FormTabs";
import { getCookie } from "@/utils/auth";
import ModalLoader from "@/components/common/Loader/Modal";

type FormSectionProps = {
    schema: z.ZodSchema;
    formData: FormSectionConfig[];
};

const FormSection = ({ schema, formData }: FormSectionProps) => {
    const { form, onSubmit, isLoading, isRedirecting } = useOnboardingForm(schema);
    const {
        control,
        formState: { errors, isValid, dirtyFields },
        trigger,
        setError,
        setValue,
        clearErrors,
        reset,
        getValues,
    } = form;

    const role = getCookie("role");
    const isVolunteer = role === "volunteer";
    const userId = getCookie(isVolunteer ? "volunteer_id" : "learner_id") || "";

    const endpoint = isVolunteer
        ? endpoints.volunteer.getIndividualVolunteer(userId)
        : endpoints.learner.getIndividualLearner(userId);

    const { data: userData, isFetching: isUserLoading } = useQuery({
        queryKey: [role],

        queryFn: async () => {
            const res = await GET_API(endpoint);
            return res.data;
        },
    });

    if (isVolunteer) {
        form.setValue("volunteer_birth_date", userData?.date_of_birth || "");
        form.setValue("volunteer_contact_details.email", userData?.email || "");
    } else if (userData?.enrolled_by === "parent") {
        form.setValue("enrolled_by", "parent");
        form.setValue("parent_info.parent_email", userData?.email || "");
        if (userData?.learner_personal_info?.learner_date_of_birth) {
            form.setValue(
                "learner_personal_info.learner_date_of_birth",
                userData?.learner_personal_info?.learner_date_of_birth
            );
        }
        form.setValue("learner_personal_info.learner_contact_details.email", userData?.email || "");
    } else {
        form.setValue("enrolled_by", "self");
        if (userData?.learner_personal_info?.learner_date_of_birth) {
            form.setValue(
                "learner_personal_info.learner_date_of_birth",
                userData?.learner_personal_info?.learner_date_of_birth || ""
            );
        } else {
            form.setValue("learner_personal_info.learner_date_of_birth", userData?.date_of_birth);
        }
        form.setValue("learner_personal_info.learner_contact_details.email", userData?.email || "");
    }
    form.setValue("cookie_consent_accepted", getCookie("cookieConsent") === "accepted");

    const validateForm = () =>
        isValid || showToast({ type: "error", message: "Fill required fields!" });

    const handleFillForm = () => {
        Object.entries(isVolunteer ? defaultVolunteerData : defaultLearnerData).forEach(
            ([key, value]) => {
                form.setValue(key, value);
            }
        );
    };

    return (
        <div>
            {isUserLoading && (
                <ModalLoader isLoading={isUserLoading} title="Fetching user details..." />
            )}
            {isRedirecting && <ModalLoader isLoading={isRedirecting} title="Loading..." />}
            <FormTabs
                reset={reset}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
                formData={formData}
                control={control}
                errors={errors}
                trigger={trigger}
                validateForm={validateForm}
                handleFillForm={handleFillForm}
                onSubmit={onSubmit}
                getValues={getValues}
                isLoading={isLoading}
            />
        </div>
    );
};

export default FormSection;
