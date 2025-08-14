"use client";

import { FormField } from "./FormField";
import CardWrapper from "../CardWrapper";
import Button from "@/components/common/Button";
import { showToast } from "@/components/common/Toast";
import { useEffect, useRef, useState } from "react";

import { validateLearnerParentFields, validateVolunteerParentDetails } from "./config";
import { UseFormSetError, UseFormClearErrors, useWatch } from "react-hook-form";
import { calculateAge, isAgeUnder18 } from "@/utils/timeFunctions";
import { ADULT_VOLUNTEER_AGE } from "@/constants/volunteer";
import { PrivacyPolicyElement, TermsAndConditionElement } from "./Consents";
import { getCookie } from "@/utils/auth";
import { GET_API, PUT_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const currentVersion = process.env.NEXT_PUBLIC_CURRENT_VERSION;

type FormTabsProps = {
    formData: FormSectionConfig[];
    control: any;
    errors: any;
    trigger: (fields: any) => Promise<boolean>;
    validateForm: () => void;
    handleFillForm: () => void;
    onSubmit: () => void;
    setError: UseFormSetError<any>;
    clearErrors: UseFormClearErrors<any>;
    setValue: (name: string, value: any, options?: any) => void;
    isLoading: boolean;
    reset: (data: any) => void;
};

const FormTabs = ({
    formData,
    control,
    errors,
    trigger,
    setError,
    clearErrors,
    setValue,
    validateForm,
    handleFillForm,
    onSubmit,
    isLoading,
    reset,
}: FormTabsProps) => {
    const role = getCookie("role");
    const isVolunteer = role === "volunteer";
    const volunteer_birth_date = useWatch({ name: "volunteer_birth_date", control: control });
    const enrolled_by = useWatch({ name: "enrolled_by", control: control });
    const [isStepUpdatePending, setIsStepUpdatePending] = useState(false);
    // Form Tabs
    const [activeTab, setActiveTab] = useState(0);
    const [highestTab, setHighestTab] = useState(0);
    const tabButtonsRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const userId = getCookie(isVolunteer ? "volunteer_id" : "learner_id") || "";

    // Utility function to filter out null values from API data
    const filterNullValues = (data: any): any => {
        if (data === null || data === undefined) return undefined;

        if (Array.isArray(data)) {
            return data.map((item) => filterNullValues(item)).filter((item) => item !== undefined);
        }

        if (typeof data === "object") {
            const filtered: any = {};
            for (const [key, value] of Object.entries(data)) {
                const filteredValue = filterNullValues(value);
                if (filteredValue !== undefined) {
                    filtered[key] = filteredValue;
                }
            }
            return Object.keys(filtered).length > 0 ? filtered : undefined;
        }

        return data;
    };

    const getOnboardingData = () => {
        if (isVolunteer) {
            return GET_API(endpoints.onboarding.getOnboardingVolunteerData(userId));
        } else {
            return GET_API(endpoints.onboarding.getOnboardingLearnerData(userId));
        }
    };

    const { data: onboardingData, isLoading: isOnboardingDataLoading } = useQuery({
        queryKey: ["onboardingData"],
        queryFn: getOnboardingData,
        enabled: !!userId,
    });

    useEffect(() => {
        if (onboardingData?.data?.onboarded_status === "partially_filled") {
            setActiveTab(onboardingData?.data?.step);
            setHighestTab(onboardingData?.data?.step);
            console.log(onboardingData?.data, "ONBOARDING DATA");

            // Filter out null values before resetting the form
            const filteredData = filterNullValues(onboardingData?.data);
            if (filteredData) {
                reset(filteredData);
            }
        }
    }, [onboardingData]);

    const handleValidationErrors = ({ success, errors }: { success: boolean; errors: any }) => {
        if (!success) {
            Object.entries(errors)?.forEach(([key, value]: any) => {
                if (key && value) setError(key, { message: value });
            });
            showToast({
                type: "error",
                message: "Please fill in all required fields before proceeding.",
            });
            return false;
        }
        return true;
    };

    const validateCurrentSection = async () => {
        const { fields, parent } = formData[activeTab];
        const currentFields = fields.map((field: any) =>
            parent ? `${parent}.${field.parent || field.id}` : field.parent || field.id
        );

        // Custom validation for phone numbers
        const phoneNumberErrors: { [key: string]: string } = {};
        let hasPhoneNumberErrors = false;

        fields.forEach((field: any) => {
            if (field.inputType === "contact-input") {
                const fieldName = parent
                    ? `${parent}.${field.parent || field.id}`
                    : field.parent || field.id;
                let fieldValue;

                if (parent) {
                    const parentKeys = parent.split(".");
                    if (parentKeys.length > 1) {
                        fieldValue =
                            control._formValues?.[parentKeys[0]]?.[parentKeys[1]]?.[field.id];
                    } else {
                        fieldValue = control._formValues?.[parent]?.[field.id];
                    }
                } else {
                    fieldValue = control._formValues?.[field.id];
                }

                if (fieldValue && fieldValue.number) {
                    const phoneNumber = fieldValue.number.toString();
                    if (phoneNumber.length !== 10) {
                        phoneNumberErrors[fieldName] = "Phone number must be exactly 10 digits";
                        hasPhoneNumberErrors = true;
                    }
                }
            }
        });

        // Also check for parent contact numbers in learner form
        if (role === "learner" && control._formValues?.parent_info?.parent_contact_number) {
            const parentPhone =
                control._formValues.parent_info.parent_contact_number.number?.toString();
            if (parentPhone && parentPhone.length !== 10) {
                phoneNumberErrors["parent_info.parent_contact_number"] =
                    "Parent phone number must be exactly 10 digits";
                hasPhoneNumberErrors = true;
            }
        }

        // If there are phone number errors, set them and return false
        if (hasPhoneNumberErrors) {
            Object.entries(phoneNumberErrors).forEach(([key, value]) => {
                setError(key, { message: value });
            });
            showToast({
                type: "error",
                message:
                    "Phone number validation failed. Please ensure all phone numbers are exactly 10 digits before proceeding.",
            });
            return false;
        }

        const isValidSection = await trigger(currentFields);

        if (role === "volunteer" && activeTab === 0) {
            const volunteerValidation = validateVolunteerParentDetails(control._formValues);
            if (!handleValidationErrors(volunteerValidation)) return false;
        }

        if (role === "learner") {
            const learnerValidation = validateLearnerParentFields(control._formValues);
            if (activeTab === 0 && highestTab > 1 && !learnerValidation?.success) {
                if (activeTab === 0) setActiveTab(1);
                return false;
            } else if (activeTab === 1 && !handleValidationErrors(learnerValidation)) {
                return false;
            }
        }

        if (!isValidSection) {
            showToast({
                type: "error",
                message: "Please fill in all required fields before proceeding.",
            });
            return false;
        }

        return true;
    };

    const learnerParentValidateKeys = [
        "parent_info.parent_first_name",
        "parent_info.parent_last_name",
        "parent_info.parent_email",
        "parent_info.parent_contact_number",
        "parent_info.relationship_to_learner",
    ];

    const handleNavigation = async (index: number, type: "next" | "tab") => {
        if (role === "learner") learnerParentValidateKeys.forEach((key) => clearErrors(key));

        if (index > activeTab) {
            const isValidSection = await validateCurrentSection();
            if (!isValidSection) return;
        }

        // Additional validation for phone numbers when navigating
        if (type === "next") {
            const currentFields = formData[activeTab]?.fields || [];
            const hasInvalidPhoneNumbers = currentFields.some((field: any) => {
                if (field.inputType === "contact-input") {
                    const fieldName = formData[activeTab]?.parent
                        ? `${formData[activeTab].parent}.${field.parent || field.id}`
                        : field.parent || field.id;

                    let fieldValue;
                    if (formData[activeTab]?.parent) {
                        const parentKeys = formData[activeTab].parent.split(".");
                        if (parentKeys.length > 1) {
                            fieldValue =
                                control._formValues?.[parentKeys[0]]?.[parentKeys[1]]?.[field.id];
                        } else {
                            fieldValue =
                                control._formValues?.[formData[activeTab].parent]?.[field.id];
                        }
                    } else {
                        fieldValue = control._formValues?.[field.id];
                    }

                    return (
                        fieldValue &&
                        fieldValue.number &&
                        fieldValue.number.toString().length !== 10
                    );
                }
                return false;
            });

            if (hasInvalidPhoneNumbers) {
                showToast({
                    type: "error",
                    message:
                        "Please fix phone number validation errors before proceeding to the next step.",
                });
                return;
            }
        }

        let isLastStep = role === "volunteer" ? index === 5 : index === 6;
        if (!isLastStep && type === "next") {
            await handleUpdateStepAndData(index, control._formValues);
        }
        setHighestTab(Math.max(highestTab, index));
        setActiveTab(index);
    };

    const handleUpdateStepAndData = async (index: number, data: any) => {
        setIsStepUpdatePending(true);
        try {
            const res = await PUT_API(
                endpoints.onboarding.update(role as "volunteer" | "learner"),
                { ...data, step: index }
            );
            console.log(res, "RES DATA");
            queryClient.invalidateQueries({ queryKey: ["onboardingData"] });
            Cookies.set("onboarded_status", "partially_filled");
        } catch (err) {
            console.log(err, "ERR DATA");
        } finally {
            setIsStepUpdatePending(false);
        }
    };

    useEffect(() => {
        if (errors?.parent_info) setActiveTab(1);
    }, [errors]);

    useEffect(() => {
        tabButtonsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeTab]);

    const consentInputs: FormField[] = [
        {
            id: "privacy_policy_accepted",
            name: "privacy_policy_accepted",
            inputType: "checkbox",
            children: <PrivacyPolicyElement enrolled_by={enrolled_by} />,
            required: true,
            inputClassName: "text-sm lg:!text-base consent-checkbox",
        },
        {
            id: "terms_and_conditions_accepted",
            name: "terms_and_conditions_accepted",
            inputType: "checkbox",
            children: <TermsAndConditionElement />,
            required: true,
            inputClassName: "text-sm lg:!text-base consent-checkbox",
        },
    ];

    const fields = ["consented_from_parent", "volunteer_parent_name", "volunteer_parent_email"];
    const volunteerAge = () => {
        const age = Number(calculateAge(volunteer_birth_date));
        return age >= ADULT_VOLUNTEER_AGE;
    };

    const hideFields = (field: any) =>
        role === "learner"
            ? enrolled_by === "parent" &&
              field.parent === "learner_contact_details" &&
              ["email", "contact_number"].includes(field.id)
            : fields.includes(field.id) && volunteerAge();

    const diableField = (field: any) =>
        role === "learner" &&
        ((enrolled_by === "parent" && field.id === "parent_email") ||
            (enrolled_by === "self" && ["email", "learner_date_of_birth"].includes(field.id)));

    return (
        <form onSubmit={onSubmit} className="w-full pb-16">
            <div ref={tabButtonsRef} className="max-w-7xl mx-auto lg:px-8">
                {/* Auto Form Fill - Only for Dev */}
                {currentVersion === "dev" && (
                    <div className="flex items-end justify-end mb-5">
                        <Button
                            onClick={handleFillForm}
                            title="Fill Form"
                            size="large"
                            customClassName="w-fit hover:!bg-green-700 !text-sm !bg-green-700 !text-white !rounded-lg !shadow-2xl !font-bold"
                        />
                    </div>
                )}

                {/* Tabs Header */}
                <div className="lg:hidden w-full text-center mt-5 lg:mt-0">
                    <p className="text-base font-medium">{`Step ${activeTab + 1}/${
                        formData.length
                    } - ${formData[activeTab]?.title}`}</p>
                </div>
                <div className="flex mb-8 gap-2 px-5">
                    {formData.map((section: any, index) => (
                        <button
                            key={section.title || index}
                            type="button"
                            onClick={() => handleNavigation(index, "tab")}
                            className={`lg:px-4 py-2 w-full text-sm font-medium ${
                                index > highestTab ? "cursor-not-allowed" : ""
                            }`}
                            disabled={index > highestTab}
                        >
                            <p className="hidden lg:block text-base">
                                {section.title || `Step ${index + 1}`}
                            </p>
                            <div
                                className={`!h-[10px] !w-full mt-1 rounded-xl ${
                                    index <= activeTab ? "!bg-background-secondary" : "!bg-gray-300"
                                }`}
                            ></div>
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {formData.map((section: any, index) => (
                    <div
                        key={index}
                        className={`!bg-white p-10 lg:rounded-3xl mx-auto px-6 lg:px-8 ${
                            activeTab === index ? "block" : "hidden"
                        }`}
                    >
                        {section?.title && (
                            <h2 className="text-2xl lg:text-3xl font-medium lg:font-semibold mb-4 lg:mb-6">
                                {section?.title}
                            </h2>
                        )}
                        <div
                            className={`grid grid-cols-2 w-full gap-3 ${
                                section?.type === "card" ? "lg:gap-6" : "lg:gap-4"
                            }`}
                        >
                            {section?.fields
                                ?.filter((field: any) => !hideFields(field))
                                .map((field: any, index: number) => {
                                    if (section?.type === "card") {
                                        const parent = section?.parent
                                            ? `${section?.parent}.${field.parent}`
                                            : field.parent;

                                        const isFieldDisabled =
                                            diableField(field) || field?.disabled;
                                        return (
                                            <CardWrapper
                                                key={field.title}
                                                index={index}
                                                title={field.title}
                                            >
                                                {field.fields.map((childField: any) => (
                                                    <FormField
                                                        key={childField.id}
                                                        field={{
                                                            ...childField,
                                                            disabled: isFieldDisabled,
                                                        }}
                                                        control={control}
                                                        errors={errors}
                                                        parent={parent}
                                                        setValue={setValue}
                                                        clearErrors={clearErrors}
                                                    />
                                                ))}
                                            </CardWrapper>
                                        );
                                    }

                                    const isFieldDisabled = diableField(field) || field?.disabled;
                                    return (
                                        <FormField
                                            key={field.id}
                                            field={{ ...field, disabled: isFieldDisabled }}
                                            control={control}
                                            errors={errors}
                                            setValue={setValue}
                                            clearErrors={clearErrors}
                                            parent={
                                                field.parent
                                                    ? `${section?.parent}.${field.parent}`
                                                    : section?.parent
                                            }
                                        />
                                    );
                                })}
                        </div>

                        <div className="mt-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                {activeTab === formData.length - 1 ? (
                                    <>
                                        <div className="text-gray-600 text-sm flex flex-col gap-3">
                                            {consentInputs.map((consent) => (
                                                <FormField
                                                    key={consent?.id}
                                                    field={consent}
                                                    control={control}
                                                    errors={errors}
                                                    parent={null}
                                                    setValue={setValue}
                                                    clearErrors={clearErrors}
                                                />
                                            ))}
                                        </div>
                                        <Button
                                            htmlType="submit"
                                            onClick={validateForm}
                                            loading={isLoading}
                                            disabled={isLoading}
                                            title="Submit Application"
                                            size="large"
                                            customClassName="w-full sm:w-[50%] lg:w-fit max-lg:mx-auto hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal"
                                        />
                                    </>
                                ) : (
                                    <Button
                                        loading={isStepUpdatePending}
                                        disabled={isStepUpdatePending}
                                        onClick={() => handleNavigation(activeTab + 1, "next")}
                                        title="Next"
                                        size="large"
                                        customClassName="w-full sm:w-[50%] lg:w-fit max-lg:mx-auto hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-medium"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
};

export default FormTabs;
