"use client";

import { Input } from "@/components/common/Input";
import SideModal from "@/components/common/Modals/SideModal";

import { useState } from "react";
import { z } from "zod";
import { VolunteerFilterModalConstants } from "@/constants/modals";

// Define Zod schema for form validation
const meetingFormSchema = z.object({
    nationality: z.string(),
    languages_known: z.string(),
    subjects: z.string(),
    available_time: z.any(),
    available_days: z.any()
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof meetingFormSchema>;

interface VolunteerFilterModalProps {
    isOpen: boolean;
    handleFilter: (data: any) => void;
    onClose: () => void;
    isFilterApplying: boolean; 
}

const initialFormData = {
    nationality: "",
    languages_known: "",
    subjects: "",
    available_time: [],
    available_days: []
}

export default function VolunteerFilterModal({ isOpen, isFilterApplying, handleFilter, onClose }: VolunteerFilterModalProps) {
    if (!isOpen) return null;
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleChange = async (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const payload = {
            nationality: formData?.nationality,
            languages_known: formData?.languages_known,
            subjects: formData?.subjects,
            available_time: { from: formData?.available_time?.from?.format('HH-mm'), to: formData?.available_time?.to?.format('HH-mm') },
            available_days: { from: formData?.available_days[0]?.format('YYYY-MM-DD'), to: formData?.available_days[1]?.format('YYYY-MM-DD') },
        };
        handleFilter(payload)
    };

    return (
        <SideModal
            title="Volunteer Filters"
            onClose={onClose}
            isOpen={isOpen}
            saveButtonText = "Apply Filters"
            cancelButtonText = "Clear All"
            onSave={handleSave}
            isDisabled={JSON.stringify(formData) === JSON.stringify(initialFormData)}
            isLoading={isFilterApplying}
            onCancel={()=>setFormData(initialFormData)}
        >
            <div className="flex flex-col px-5 mt-7">
                {VolunteerFilterModalConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...field}
                        onChange={(value: any) => handleChange(field.name, value)}
                        value={formData[field.name as keyof FormData]}
                        required={field.required}
                    />
                ))}
            </div>
        </SideModal>
    );
}