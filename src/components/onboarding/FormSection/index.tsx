"use client";

import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";
import { showToast } from "@/components/common/Toast";
import { defaultLearnerData, defaultVolunteerData } from "./config";
import FormTabs from "./FormTabs";

type FormSectionProps = {
    schema: z.ZodSchema;
    formData: FormSectionConfig[];
};

const FormSection = ({ schema, formData }: FormSectionProps) => {
    const { form, onSubmit, isLoading } = useOnboardingForm(schema);
    const { control, formState: { errors, isValid, dirtyFields }, trigger, setError, setValue } = form;

    const role = Cookies.get("role");
    const isVolunteer = role === "volunteer";

    const userId = Cookies.get(isVolunteer ? "volunteer_id" : "learner_id") || "";
    const endpoint = isVolunteer
        ? endpoints.volunteer.getIndividualVolunteer(userId)
        : endpoints.learner.getIndividualLearner(userId);

    const { data: userData } = useQuery({
        queryKey: [role],
        queryFn: async () => {
            const res = await GET_API(endpoint);
            return res.data;
        },
    });

    form.setValue(
        isVolunteer
            ? "volunteer_contact_details.email"
            : "learner_personal_info.learner_contact_details.email",
        userData?.email || ""
    );

    const validateForm = () => isValid || showToast({ type: "error", message: "Fill required fields!" });

    console.log(dirtyFields, errors, "dirtyFields", control._formValues);

    const handleFillForm = () => {
        Object.entries(isVolunteer ? defaultVolunteerData : defaultLearnerData).forEach(
            ([key, value]) => {
                form.setValue(key, value);
            }
        );
        form.setValue(
            isVolunteer
                ? "volunteer_contact_details.email"
                : "learner_personal_info.learner_contact_details.email",
            userData?.email || ""
        );
    };

    return (
        <div>
            <FormTabs 
                setValue={setValue}
                setError={setError}
                formData={formData}
                control={control}
                errors={errors}
                trigger={trigger}
                validateForm={validateForm}
                handleFillForm={handleFillForm}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default FormSection;