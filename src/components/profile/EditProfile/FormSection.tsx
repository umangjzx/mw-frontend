"use client";

import { FormField } from "@/components/onboarding/FormSection/FormField";
import Button from "@/components/common/Button";
import { showToast } from "@/components/common/Toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { validateLearnerParentFields, validateVolunteerParentDetails } from "@/components/onboarding/FormSection/config";
import { UseFormSetError, useWatch } from "react-hook-form";
import { calculateAge } from "@/utils/timeFunctions";
import { ADULT_VOLUNTEER_AGE } from "@/constants/volunteer";
import TagComponent from "@/components/common/Tag";

type FormTabsSectionProps = {
    formData: FormSectionConfig[];
    control: any;
    errors: any;
    trigger: (fields: any) => Promise<boolean>;
    validateForm: () => void;
    handleFillForm?: () => void;
    onSubmit: () => void;
    setError: UseFormSetError<any>;
    setValue: (name: string | any, value: any, options?: any) => void;
    isLoading: boolean;
};


const FormTabsSection = ({ formData, control, errors, trigger, setError, setValue, validateForm, handleFillForm, onSubmit, isLoading }: FormTabsSectionProps) => {
    const role = Cookies.get("role");

    const volunteer_birth_date = useWatch({ name: 'volunteer_birth_date', control: control })

    // Form Tabs
    const [activeTab, setActiveTab] = useState(0);
    const [highestTab, setHighestTab] = useState(0);
    const tabButtonsRef = useRef<HTMLDivElement>(null);

    const validateCurrentSection = async () => {
        const { fields, parent } = formData[activeTab];
        const currentFields = fields.map((field) =>
            parent ? `${parent}.${field.parent || field.id}` : field.parent || field.id
        );

        const handleValidationErrors = ({ success, errors }: { success: boolean; errors: any }) => {
            if (!success) {
                Object.entries(errors)?.forEach(([key, value]: any) => {
                    if (key && value) setError(key, { message: value });
                });
                showToast({ type: "error", message: "Please fill in all required fields before proceeding." });
                return false;
            }
            return true;
        };

        const validateAgeUnder18 = (dob: string | undefined) => {
            const age = dob && moment().diff(moment(dob, "DD-MM-YYYY"), "years") || 0;
            return age < 18;
        };

        const isValidSection = await trigger(currentFields);
        if (!isValidSection) {
            showToast({ type: "error", message: "Please fill in all required fields before proceeding." });
            return false;
        }

        if (role === "learner") {
            const learnerAge = control._formValues?.learner_personal_info?.learner_date_of_birth;
            if (!validateAgeUnder18(learnerAge)) return true;

            const learnerValidation = validateLearnerParentFields(control._formValues);
            if ((activeTab === 0 && highestTab > 1) || (activeTab === 1)) {
                if (!handleValidationErrors(learnerValidation)) {
                    if (activeTab === 0) setActiveTab(1);
                    return false;
                }
            }
        }

        if (role === "volunteer" && activeTab === 0) {
            const volunteerValidation = validateVolunteerParentDetails(control._formValues);
            if (!handleValidationErrors(volunteerValidation)) return false;
        }

        return true;
    };

    const handleNavigation = async (index: number) => {
        if (index > activeTab) {
            const isValidSection = await validateCurrentSection();
            if (!isValidSection) return;
        }
        setActiveTab(index);
        setHighestTab(Math.max(highestTab, index));
    };

    useEffect(() => {
        if (errors?.parent_info) setActiveTab(1)
    }, [errors])

    useEffect(() => {
        tabButtonsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeTab]);

    const fields = ["consented_from_parent", "volunteer_parent_name", "volunteer_parent_email"]
    const volunteerAge = () => {
        const age = Number(calculateAge(volunteer_birth_date));
        return age >= ADULT_VOLUNTEER_AGE;
    }

    const hideFields = (field: any) => {
        if (role === "learner") return false;
        return fields.includes(field.id) && volunteerAge();
    };

    return (
        <form onSubmit={onSubmit} className="w-full">
            <div ref={tabButtonsRef} className="mx-auto pb-2">

                <div className="flex md:flex-wrap max-md:overflow-x-auto no-scrollbar py-3 gap-2 sticky top-0 bg-background-input md:bg-white z-10 border-b border-gray-500 md:border-stroke">
                    {formData.map((section: any, index) => (
                        <button
                            key={section.title || index}
                            type="button"
                            onClick={() => handleNavigation(index)}
                        >
                            <TagComponent
                                text={section.title}
                                className={`!text-sm md:!text-base py-1 px-3 border ${activeTab === index ? "bg-background border-primary" : "bg-white md:bg-background-input text-gray-dark border-gray-500 md:border-gray-dark"}`}
                            />
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {formData.map((section: any, index) => (
                    <div key={index} className={`md:!bg-white lg:rounded-3xl px-2 md:px-3 mx-auto py-5 ${activeTab === index ? 'block' : 'hidden'}`}>
                        {section?.title && (
                            <h2 className="text-2xl lg:text-2xl font-medium lg:font-semibold mb-4 lg:mb-5">{section?.title}</h2>
                        )}
                        <div className={`grid grid-cols-1 w-full gap-3 ${section?.type === "card" ? "lg:gap-5" : "lg:gap-3"}`}>
                            {section?.fields?.filter((field: any) => !hideFields(field)).map((field: any, index: number) => {
                                if (section?.type === "card") {
                                    const parent = section?.parent
                                        ? `${section?.parent}.${field.parent}`
                                        : field.parent;

                                    return (
                                        <div key={field.title} className="border-b border-stroke pb-4">
                                            <h3 className="text-xl font-medium mb-2">{field.title}</h3>
                                            <div className="flex flex-col gap-2 md:gap-1">
                                                {field.fields.map((childField: any) => (
                                                    <FormField
                                                        key={childField.id}
                                                        field={{...childField, gridCols: 2, rootClassName: `${childField.rootClassName} max-md:!bg-white max-md:!p-4 max-md:!rounded-lg` }}
                                                        control={control}
                                                        errors={errors}
                                                        parent={parent}
                                                        setValue={setValue}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <FormField
                                        key={field.id}
                                        field={{...field, gridCols: 2, rootClassName: `${field.rootClassName} max-md:!bg-white max-md:!p-4 max-md:!rounded-lg` }}
                                        control={control}
                                        errors={errors}
                                        setValue={setValue}
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
                                        onClick={() => handleNavigation(activeTab + 1)}
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

export default FormTabsSection;