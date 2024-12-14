"use client";

import { FormField } from "./FormField";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import Divider from "@/components/common/Divider";
import CardWrapper from "../CardWrapper";
import Button from "@/components/common/Button";
import Link from "next/link";
import { z } from "zod";

type FormSectionProps = {
    schema: z.ZodSchema;
    formData: FormSectionConfig[];
};

const FormSection = ({ schema, formData }: FormSectionProps) => {
    const { form, onSubmit, isLoading } = useOnboardingForm(schema);
    const {
        control,
        formState: { errors, isValid, dirtyFields },
    } = form;


    console.log(dirtyFields, errors, "dirtyFields" , control._formValues);

    return (
        <form onSubmit={onSubmit} className='w-full pb-16'>
            <div className='max-w-7xl p-10 bg-white rounded-3xl mx-auto px-4 sm:px-6 lg:px-8'>
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
