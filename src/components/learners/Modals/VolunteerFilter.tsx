"use client";

import { Input } from "@/components/common/Input";
import SideModal from "@/components/common/Modals/SideModal";
import { useState, useMemo } from "react";
import { z } from "zod";
import { VolunteerFilterModalConstants } from "@/constants/modals";

// Define Zod schema for form validation
const meetingFormSchema = z.object({
    nationality: z.string(),
    languages_known: z.array(z.string()).optional(),
    subjects: z.array(z.string()).optional(),
    available_time: z.any(),
    available_days: z.any(),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof meetingFormSchema>;

interface VolunteerFilterModalProps {
    isOpen: boolean;
    handleFilter: (data: FormData) => void;
    onClose: () => void;
    isFilterApplying: boolean;
}

const initialFormData: FormData = {
    nationality: "",
    languages_known: [],
    subjects: [],
    available_time: [],
    available_days: [],
};

export default function VolunteerFilterModal({ isOpen, isFilterApplying, handleFilter, onClose }: VolunteerFilterModalProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const isFormUnchanged = useMemo(
        () => JSON.stringify(formData) === JSON.stringify(initialFormData),
        [formData]
    );

    const handleChange = (name: keyof FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        handleFilter(formData);
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    if (!isOpen) return null;

    return (
        <SideModal
            title="Volunteer Filters"
            onClose={onClose}
            isOpen={isOpen}
            saveButtonText="Apply Filters"
            cancelButtonText="Clear All"
            onSave={handleSave}
            isDisabled={isFormUnchanged}
            isLoading={isFilterApplying}
            onCancel={handleClear}
        >
            <div className="flex flex-col px-5 mt-7">
                {VolunteerFilterModalConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...field}
                        onChange={(value: any) => handleChange(field.name as keyof FormData, value)}
                        value={formData[field.name as keyof FormData]}
                    />
                ))}
            </div>
        </SideModal>
    );
}