"use client";

import { FormField } from "./FormField";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import Divider from "@/components/common/Divider";
import CardWrapper from "../CardWrapper";
import Button from "@/components/common/Button";
import Link from "next/link";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";
import { showToast } from "@/components/common/Toast";
import { defaultLearnerData, defaultVolunteerData } from "./config";

type FormSectionProps = {
    schema: z.ZodSchema;
    formData: FormSectionConfig[];
};

const FormSection = ({ schema, formData }: FormSectionProps) => {
    const { form, onSubmit, isLoading } = useOnboardingForm(schema);
    const {
        control,
        formState: { errors, isValid, dirtyFields }
    } = form;

    const role = Cookies.get("role");
    const isVolunteer = role === "volunteer";

    const userId = Cookies.get(isVolunteer ? "volunteer_id" : "learner_id") || "";
    const endpoint = isVolunteer ? endpoints.volunteer.getIndividualVolunteer(userId) : endpoints.learner.getIndividualLearner(userId)

    const { data: userData } = useQuery({
        queryKey: [role],
        queryFn: async () => {
            const res = await GET_API(endpoint);
            return res.data;
        },
    })
    form.setValue(isVolunteer ? "volunteer_contact_details.email" : "learner_personal_info.learner_contact_details.email", userData?.email)
    
    const validateForm = () => isValid ? showToast({ type: "success", message: "Form Submitted" }) : showToast({ type: "error", message: "Fill required fields!" });

    console.log(dirtyFields, errors, "dirtyFields", control._formValues);

    return (
        <form onSubmit={onSubmit} className='w-full pb-16'>
            <div className='max-w-7xl p-10 bg-white rounded-3xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Auto Form Fill - Only for Dev */}
                <div className="flex items-end justify-end">
                    <Button
                        loading={isLoading}
                        onClick={() => { form.reset(isVolunteer ? defaultVolunteerData : defaultLearnerData) }}
                        title='Fill Form'
                        size='large'
                        customClassName='w-fit hover:!bg-green-700 !text-sm !bg-green-700 !text-white !rounded-lg !shadow-2xl !font-bold'
                    />
                </div>

                {formData.map((section, sectionIndex) => (
                    <div key={section.title} className={sectionIndex > 0 ? "mt-12" : ""}>
                        {section.title && (
                            <h2 className='text-3xl font-semibold mb-8'>{section.title}</h2>
                        )}
                        <div className='grid grid-cols-2 w-full gap-6'>
                            {section.fields.map((field, index) => {
                                if (section?.type === "card") {
                                    const parent = section.parent
                                        ? `${section.parent}.${field.parent}`
                                        : section.parent;

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
                                                ? `${section.parent}.${field.parent}`
                                                : section.parent
                                        }
                                    />
                                );
                            })}
                        </div>
                        <Divider className='my-8' />
                    </div>
                ))}

                <div className='mt-5 flex flex-col gap-4'>
                    <Button
                        loading={isLoading}
                        htmlType='submit'
                        onClick={validateForm}
                        title='Submit Application'
                        size='large'
                        customClassName='w-fit hover:!bg-background-secondary !text-sm !bg-background-secondary !text-black !rounded-lg !shadow-2xl !font-normal'
                    />
                    <p className='text-gray-600 text-sm'>
                        By clicking on the Submit Application above, you agree to our{" "}
                        <Link
                            href='/terms-of-service'
                            className='text-black underline hover:underline font-medium'
                        >
                            Terms of Service
                        </Link>{" "}
                        and our{" "}
                        <Link
                            href='/privacy-policy'
                            className='text-black underline hover:underline font-medium'
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </form>
    );
};

export default FormSection;
