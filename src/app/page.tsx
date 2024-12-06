"use client";
import React, { useState } from "react";
import { FormField, ImageFile } from "@/components/common/Input/input.d";
import { FeedbackModal } from "@/components/schedule/Modals";
import { MessageModal, TestmonialModal } from "@/components/volunteer/Modals";
import { ResourceModal } from "@/components/resources/Modals";
import { PostModal } from "@/components/community/Modals";
import { ProfileModal } from "@/components/profile/Modals";
import Calender from "@/components/schedule/Calender";



const formFields: FormField[] = [
    {
        name: "fullName",
        label: "Full Name",
        inputType: "text",
        placeholder: "Enter your full name",
        required: true,
        sublabel: "Please enter your full name",
        sublabelAlignment: "bottom"
    },
    {
        name: "relationship",
        label: "Relationship to Child",
        inputType: "select",
        options: [
            { label: "Parent", value: "parent" },
            { label: "Guardian", value: "guardian" },
            { label: "Other", value: "other" },
        ],
        required: true,
        sublabel: "Select your relationship",
        sublabelAlignment: "bottom"
    },
    {
        name: "dateOfBirth",
        label: "Date of Birth",
        inputType: "datepicker",
        required: true,
    },
    {
        name: "specialNeeds",
        label: "Special Needs",
        inputType: "multiselect",
        options: [
            { label: "ADHD", value: "adhd" },
            { label: "Autism", value: "autism" },
            { label: "Dyslexia", value: "dyslexia" },
        ],
    },
    {
        name: "notes",
        label: "Additional Notes",
        inputType: "textarea",
        placeholder: "Enter any additional information",
    },
    {
        name: "consent",
        label: "Consent",
        inputType: "checkbox",
        placeholder: "I agree to the terms and conditions",
        required: true,
    },
    {
        name: "dateOfBirthFormat",
        label: "Date of Birth",
        inputType: "radio",
        options: [
            {
                label: "MM/DD/YY",
                value: "mmddyy",
                sublabel: "American format",
            },
            {
                label: "DD/MM/YY",
                value: "ddmmyy",
                sublabel: "European format",
            },
            {
                label: "Prefer not to specify",
                value: "none",
                sublabel: "Skip this question",
            },
        ],
    },
    {
        name: "emergencyContact",
        label: "Emergency Contact Number",
        sublabel: "Please provide a number we can reach in case of emergency",
        inputType: "text",
        placeholder: "Phone number",
        required: true,
    },
    {
        name: "learningStyle",
        label: "Learning Style",
        sublabel: "Choose the style that best describes how your child learns",
        inputType: "select",
        options: [
            { label: "Visual", value: "visual" },
            { label: "Auditory", value: "auditory" },
            { label: "Kinesthetic", value: "kinesthetic" },
        ],
    },
    {
        name: "satisfaction",
        label: "How satisfied are you with our service?",
        sublabel: "Please rate your experience",
        inputType: "radio",
        variant: "rating",
        options: [
            { label: "Bad", value: "1" },
            { label: "Normal", value: "2" },
            { label: "Good", value: "3" },
            { label: "Very Good", value: "4" },
            { label: "Excellent", value: "5" },
        ],
    },
    {
        name: "images",
        label: "Upload Images",
        sublabel: "Upload relevant images",
        inputType: "image-upload",
        maxFiles: 5,
    },
];

interface FormData {
    [key: string]: any;
    images: ImageFile[];
}

export default function FormPage() {
    const [formData, setFormData] = useState<FormData>({
        images: [],
    });

    const handleInputChange = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form data:", formData);
    };

    return (
        <div className="w-screen h-screen mx-auto p-6">
            {/* <h1 className="text-2xl font-bold mb-6">Registration Form</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {formFields.map((field) => (
                    <Input
                        key={field.name}
                        {...field}
                        value={formData[field.name]}
                        onChange={(value : any) => handleInputChange(field.name, value)}
                    />
                ))}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Submit
                </button>
            </form> */}
            <FeedbackModal isOpen={false} mode="create" />
            <MessageModal isOpen={false} />
            <TestmonialModal isOpen={false} mode="create" />
            <ResourceModal isOpen={false} mode="create" />
            <PostModal isOpen={false} />
            <ProfileModal isOpen={false} />
            <Calender />
        </div>
    );
}
