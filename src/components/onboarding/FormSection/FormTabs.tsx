"use client";

import { FormField } from "./FormField";
import CardWrapper from "../CardWrapper";
import Button from "@/components/common/Button";
import Link from "next/link";
import { showToast } from "@/components/common/Toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { validateLearnerParentFields, validateVolunteerParentDetails } from "./config";
import { UseFormSetError, useWatch } from "react-hook-form";
import { calculateAge } from "@/utils/timeFunctions";

type FormTabsProps = {
    formData: FormSectionConfig[];
    control: any;
    errors: any;
    trigger: (fields: any) => Promise<boolean>;
    validateForm: () => void;
    handleFillForm: () => void;
    onSubmit: () => void;
    setError: UseFormSetError<any>;
    setValue: (name: string, value: any, options?: any) => void;
    isLoading: boolean;
};

const TermsAndConditionElement = <div>
    By clicking on the Submit Application above, you agree to our {" "}
    <Link
        href="https://glib-chiller-6dc.notion.site/Terms-Conditions-1702f1842d7a80dea739d037e7b7133e"
        target="_blank"
        className="text-black underline hover:underline font-medium"
    >
        Terms of Service
    </Link>{" "}
    and our {" "}
    <Link
        href="https://glib-chiller-6dc.notion.site/Privacy-Policy-1702f1842d7a80f1b2ecc65ec0ef459e"
        target="_blank"
        className="text-black underline hover:underline font-medium"
    >
        Privacy Policy
    </Link>
    .
</div>

const termsAndConditionsInput: FormField = {
    id: "terms_and_conditions_accepted",
    name: "terms_and_conditions_accepted",
    inputType: "checkbox",
    children: TermsAndConditionElement,
    required: true
}

const currentVersion = process.env.NEXT_PUBLIC_CURRENT_VERSION;

const FormTabs = ({ formData, control, errors, trigger, setError, setValue, validateForm, handleFillForm, onSubmit, isLoading }: FormTabsProps) => {
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

        const isValidSection = await trigger(currentFields);
        if (!isValidSection) {
            showToast({ type: "error", message: "Please fill in all required fields before proceeding." });
            return false;
        }

        const runValidation = (validationFn: Function) => {
            const validation = validationFn(control?._formValues);
            if (!validation.success) {
                Object.entries(validation.errors).forEach(([key, value]: any) => {
                    if (key && value) {
                        setError(key, { message: value });
                    }
                });
                showToast({ type: "error", message: "Please fill in all required fields before proceeding." });
                return false;
            }
            return true;
        };

        if (role === "learner" && activeTab <= 1) {
            const isLearnerUnder18 = () => {
                const learnerDOB = control?._formValues?.learner_personal_info?.learner_date_of_birth;
                const age = learnerDOB ? moment().diff(moment(learnerDOB), 'years') : null;
                return age !== null && age < 18;
            };
            if (isLearnerUnder18() && !runValidation(validateLearnerParentFields)) {
                if (activeTab !== 1) setActiveTab(1);
                return false;
            }
        }

        if (role === "volunteer" && activeTab === 0) {
            if (!runValidation(validateVolunteerParentDetails)) {
                return false;
            }
        }

        return isValidSection;
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

    const fields = ["consented_from_parent", "volunteer_parent_fullname", "volunteer_parent_email"]
    const volunteerAge = () => {
        const age = Number(calculateAge(volunteer_birth_date));
        return age > 18;
    }

    const hideFields = (field: any) => {
        if (role === "learner") return false;
        return fields.includes(field.id) && volunteerAge();
    };

    return (
        <form onSubmit={onSubmit} className="w-full pb-16">
            <div className="max-w-7xl mx-auto lg:px-8">
                {/* Auto Form Fill - Only for Dev */}
                {currentVersion === "dev" && <div className="flex items-end justify-end mb-5">
                    <Button
                        onClick={handleFillForm}
                        title="Fill Form"
                        size="large"
                        customClassName="w-fit hover:!bg-green-700 !text-sm !bg-green-700 !text-white !rounded-lg !shadow-2xl !font-bold"
                    />
                </div>}

                {/* Tabs Header */}
                <div className="md:hidden w-full text-center mb-3">
                    <p className="font-semibold">{`Step ${activeTab + 1}/${formData.length} - ${formData[activeTab]?.title}`}</p>
                </div>
                <div ref={tabButtonsRef} className="flex mb-8 gap-2 px-5">
                    {formData.map((section: any, index) => (
                        <button
                            key={section.title || index}
                            type="button"
                            onClick={() => handleNavigation(index)}
                            className={`md:px-4 py-2 w-full text-sm font-medium ${index > highestTab ? "cursor-not-allowed" : ""}`}
                            disabled={index > highestTab}
                        >
                            <p className="hidden md:block">{section.title || `Step ${index + 1}`}</p>
                            <div className={`!h-[10px] !w-full mt-1 rounded-xl ${index <= activeTab ? "!bg-background-secondary" : "!bg-gray-300"}`}></div>
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {formData.map((section: any, index) => (
                    <div className={`!bg-white p-10 md:rounded-3xl mx-auto px-6 lg:px-8 ${activeTab === index ? 'block' : 'hidden'}`}>
                        {section?.title && (
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-8">{section?.title}</h2>
                        )}
                        <div className="grid grid-cols-2 w-full gap-6">
                            {section?.fields?.filter((field: any) => !hideFields(field)).map((field: any, index: number) => {
                                if (section?.type === "card") {
                                    const parent = section?.parent
                                        ? `${section?.parent}.${field.parent}`
                                        : field.parent;

                                    return (
                                        <CardWrapper
                                            key={field.title}
                                            index={index}
                                            title={field.title}
                                        >
                                            {field.fields.map((childField: any) => (
                                                <FormField
                                                    key={childField.id}
                                                    field={childField}
                                                    control={control}
                                                    errors={errors}
                                                    parent={parent}
                                                    setValue={setValue}
                                                />
                                            ))}
                                        </CardWrapper>
                                    );
                                }

                                return (
                                    <FormField
                                        key={field.id}
                                        field={field}
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
                                        <p className="text-gray-600 text-sm">
                                            <FormField
                                                key="terms_and_conditions_accepted"
                                                field={termsAndConditionsInput}
                                                control={control}
                                                errors={errors}
                                                parent={null}
                                                setValue={setValue}
                                            />

                                        </p>
                                        <Button
                                            htmlType="submit"
                                            onClick={validateForm}
                                            loading={isLoading}
                                            disabled={isLoading}
                                            title="Submit Application"
                                            size="large"
                                            customClassName="w-fit hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal"
                                        />
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => handleNavigation(activeTab + 1)}
                                        title="Next"
                                        size="large"
                                        customClassName="w-fit hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal"
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