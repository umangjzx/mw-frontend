"use client";

import { FormField } from "./FormField";
import CardWrapper from "../CardWrapper";
import Button from "@/components/common/Button";
import Link from "next/link";
import { showToast } from "@/components/common/Toast";
import { useEffect, useRef, useState } from "react";

type FormTabsProps = {
    formData: FormSectionConfig[];
    control: any;
    errors: any;
    trigger: (current: any) => any;
    validateForm: () => any;
    handleFillForm: () => any;
    onSubmit: () => any;
    isLoading: boolean;
};

const FormTabs = ({ formData, control, errors, trigger, validateForm, handleFillForm, onSubmit, isLoading }: FormTabsProps) => {
    // Form Tabs
    const [activeTab, setActiveTab] = useState(0);
    const [highestTab, setHighestTab] = useState(0);

    const [activeTabFields, setActiveTabFields] = useState(formData[activeTab]);

    const tabButtonsRef = useRef<HTMLDivElement>(null);

    const validateCurrentSection = async () => {
        const currentFields = activeTabFields.fields.map(
            (field) => (field.parent ? `${activeTabFields.parent}.${field.parent}` : field.id)
        );

        const isValidSection = await trigger(currentFields);
        if (!isValidSection) {
            showToast({ type: "error", message: "Please fill in all required fields before proceeding." });
        }
        return isValidSection;
    };

    const handleNext = async () => {
        const isValidSection = await validateCurrentSection();
        if (isValidSection) {
            const nextTab = activeTab + 1;
            setActiveTab(nextTab);
            setHighestTab(Math.max(highestTab, nextTab));
        }
    };

    const handleTabClick = async (index: number) => {
        if (index > activeTab) {
            const isValidSection = await validateCurrentSection();
            if (isValidSection) {
                setActiveTab(index);
                setHighestTab(Math.max(highestTab, index));
            }
        } else {
            setActiveTab(index);
        }
    };

    useEffect(() => {
        if (tabButtonsRef.current) {
            tabButtonsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setActiveTabFields(activeTabFields);
    }, [activeTab]);

    return (
        <form onSubmit={onSubmit} className="w-full pb-16">
            <div className="max-w-7xl px-10 mx-auto sm:px-6 lg:px-8">
                {/* Auto Form Fill - Only for Dev */}
                <div className="flex items-end justify-end mb-5">
                    <Button
                        onClick={handleFillForm}
                        title="Fill Form"
                        size="large"
                        customClassName="w-fit hover:!bg-green-700 !text-sm !bg-green-700 !text-white !rounded-lg !shadow-2xl !font-bold"
                    />
                </div>
                <div ref={tabButtonsRef} />

                {/* Tabs Header */}
                <div className="flex mb-8 gap-2">
                    {formData.map((section, index) => (
                        <button
                            key={section.title}
                            type="button"
                            onClick={() => handleTabClick(index)}
                            className={`px-4 py-2 w-full text-sm font-medium`}
                            disabled={index > highestTab}
                        >
                            {section?.title || `Step ${index + 1}`}
                            <div className={`!h-[10px] !w-full mt-1 rounded-xl ${index <= activeTab ? '!bg-background-secondary' : '!bg-gray-light'}`}></div>
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {activeTabFields && (
                    <div key={activeTabFields.title} className="!bg-white p-10 rounded-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        {activeTabFields.title && (
                            <h2 className="text-3xl font-semibold mb-8">{activeTabFields.title}</h2>
                        )}
                        <div className="grid grid-cols-2 w-full gap-6">
                            {activeTabFields?.fields.map((field, index) => {
                                if (activeTabFields?.type === "card") {
                                    const parent = activeTabFields.parent
                                        ? `${activeTabFields.parent}.${field.parent}`
                                        : activeTabFields.parent;

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
                                        parent={
                                            field.parent
                                                ? `${activeTabFields.parent}.${field.parent}`
                                                : activeTabFields.parent
                                        }
                                    />
                                );
                            })}
                        </div>
                        <div className="mt-5 flex flex-col gap-4">
                            <div className="flex gap-4 justify-between">
                                {activeTab === formData.length - 1 ? (
                                    <>
                                        <Button
                                            htmlType="submit"
                                            onClick={validateForm}
                                            isLoading={isLoading}
                                            title="Submit Application"
                                            size="large"
                                            customClassName="w-fit hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal"
                                        />
                                        <p className="text-gray-600 text-sm">
                                            By clicking on the Submit Application above, you agree to our{" "}
                                            <Link
                                                href="/terms-of-service"
                                                className="text-black underline hover:underline font-medium"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and our{" "}
                                            <Link
                                                href="/privacy-policy"
                                                className="text-black underline hover:underline font-medium"
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
                                        </p>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        title="Next"
                                        size="large"
                                        customClassName="w-fit hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default FormTabs;