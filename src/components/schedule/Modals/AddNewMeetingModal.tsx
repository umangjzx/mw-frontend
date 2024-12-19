"use client";
import { endpoints } from "@/api/constants";
import { GET_API, POST_API } from "@/api/request";
import { Input } from "@/components/common/Input";
import SideModal from "@/components/common/Modals/SideModal";
import {
    LearnerScheduleModalConstants,
    LearnerScheduleModalDescriptionConstants,
} from "@/constants/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import AvailableSlots from "../AvailableSlots/AvailableSlots";
import { useSearchParams } from "next/navigation";
import { useSendData } from "@/hooks/useReactQuery";
import { z } from "zod";

// Define Zod schema for form validation
const meetingFormSchema = z.object({
    title_of_the_meeting: z.string().min(1, "Meeting title is required"),
    select_volunteer: z.string().min(1, "Please select a volunteer"),
    select_date: z
        .union([z.string(), z.date(), z.null()])
        .refine((val) => val !== null && val !== "", {
            message: "Please select a date",
        }),
    start_time: z.string(),
    end_time: z.string(),
    google_meet_link: z.string(),
    description: z.string().min(1, "Description is required"),
    selected_slot: z.string().min(1, "Please select a time slot"),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof meetingFormSchema>;

interface AddNewMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddNewMeetingModal({ isOpen, onClose }: AddNewMeetingModalProps) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<FormData>({
        title_of_the_meeting: "",
        select_volunteer: "",
        select_date: "",
        start_time: "",
        end_time: "",
        google_meet_link: "",
        description: "",
        selected_slot: "",
    });
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [volunteers, setVolunteers] = useState<Array<{ label: string; value: string }>>([]);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const volunteerId = searchParams.get("volunteerId");
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [slotError, setSlotError] = useState<string>("");
    const [fetchingSlots, setFetchingSlots] = useState<boolean>(false);

    const getVolunteers = async () => {
        const response = await GET_API(endpoints.volunteer.getAllVolunteers);
        const volunteerOptions = response.data.items.map((volunteer: any) => ({
            label: volunteer.volunteer_first_name + " " + volunteer.volunteer_last_name, // Adjust according to your API response structure
            value: volunteer.volunteer_id,
        }));
        if (volunteerId) {
            const volunteer = volunteerOptions.find(
                (volunteer: any) => volunteer.value === volunteerId
            );
            if (volunteer) {
                setFormData((prev) => ({ ...prev, select_volunteer: volunteer.value }));
            }
        }
        setVolunteers(volunteerOptions);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["volunteers"],
        queryFn: getVolunteers,
        enabled: isOpen,
    });

    const handleChange = async (name: string, value: any) => {
        const processedValue = name === "select_date" && !value ? null : value;

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));

        // Clear error for the field being changed
        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));

        // If changing date or volunteer, reset slot selection and its error
        if (name === "select_date" || name === "select_volunteer") {
            setFormData((prev) => ({
                ...prev,
                selected_slot: "",
                start_time: "",
                end_time: "",
            }));

            // Clear available slots and set error when date is cleared
            if (name === "select_date" && !value) {
                setAvailableSlots([]);
                setSlotError("Please select a date first");
                return;
            }
        }

        // Validate single field
        try {
            const fieldSchema = meetingFormSchema.pick({ [name]: true } as any);
            fieldSchema.parse({ [name]: processedValue });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldError = error.errors[0];
                setErrors((prev) => ({
                    ...prev,
                    [name]: fieldError.message,
                }));
            }
        }

        // Check for date selection and if we have a selected volunteer
        if (name === "select_date" && value && formData.select_volunteer) {
            const formattedDate = moment(value).format("YYYY-MM-DD");
            setSlotError("");
            setFetchingSlots(true);
            try {
                const response = await GET_API(
                    endpoints.volunteer_slot.availableSlots(
                        formData.select_volunteer,
                        formattedDate
                    )
                );
                if (response.data.slots.length === 0) {
                    setSlotError("No slots available for this date");
                    setAvailableSlots([]);
                    setFetchingSlots(false);
                } else {
                    setAvailableSlots(response.data.slots);
                    setSlotError("");
                    setFetchingSlots(false);
                }
            } catch (error) {
                setAvailableSlots([]);
                setSlotError("No slots available for this date");
                setFetchingSlots(false);
                console.error("Error fetching available slots:", error);
            }
        }

        // When volunteer is selected and we already have a date, fetch available slots
        if (name === "select_volunteer" && value && formData.select_date) {
            const formattedDate = moment(formData.select_date).format("YYYY-MM-DD");
            setSlotError("");
            setFetchingSlots(true);
            try {
                const response = await GET_API(
                    endpoints.volunteer_slot.availableSlots(value, formattedDate)
                );
                if (response.data.slots.length === 0) {
                    setSlotError("No slots available for this date");
                    setAvailableSlots([]);
                    setFetchingSlots(false);
                } else {
                    setAvailableSlots(response.data.slots);
                    setSlotError("");
                    setFetchingSlots(false);
                }
            } catch (error) {
                setAvailableSlots([]);
                setSlotError("No slots available for this date");
                setFetchingSlots(false);
                console.error("Error fetching available slots:", error);
            }
        }
    };

    const getFieldProps = (field: any) => {
        if (field.name === "select_volunteer") {
            return {
                ...field,
                options: volunteers,
            };
        }
        return field;
    };

    const handleSlotSelection = (slotId: string, startTime: string, endTime: string) => {
        setFormData((prev) => ({
            ...prev,
            selected_slot: slotId,
            start_time: startTime,
            end_time: endTime,
        }));
        setSlotError("");
        setErrors((prev) => ({
            ...prev,
            selected_slot: undefined,
        }));
    };

    const validateForm = (): boolean => {
        try {
            meetingFormSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof FormData, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSave = async () => {
        const payload = {
            volunteer_id: formData.select_volunteer,
            volunteer_slot_id: formData.selected_slot,
            session_date: moment(formData.select_date).format("YYYY-MM-DD"),
            session_start_time: formData.start_time,
            session_end_time: formData.end_time,
            session_title: formData.title_of_the_meeting,
            session_description: formData.description,
        };
        return await POST_API(endpoints.session.bookSession, payload);
    };

    const { mutate: onSave, isPending } = useSendData({
        fn: () => handleSave(),
        invalidateKey: ["events"],
        success: () => {
            setFormData({
                title_of_the_meeting: "",
                select_volunteer: "",
                select_date: "",
                start_time: "",
                end_time: "",
                google_meet_link: "",
                description: "",
                selected_slot: "",
            });
            setAvailableSlots([]);
            onClose();
        },
        error: (err) => {
            console.log("Error: ", err);
        },
    });

    const handleSubmit = () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        onSave(formData);
    };

    return (
        <SideModal
            title="Add New Meeting"
            onClose={onClose}
            isOpen={isOpen}
            onSave={handleSubmit}
            isLoading={isPending}
            onCancel={onClose}
        >
            <div className="flex flex-col px-5 mt-7">
                {LearnerScheduleModalConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...getFieldProps(field)}
                        onChange={(value: any) => handleChange(field.name, value)}
                        value={formData[field.name as keyof FormData]}
                        required={field.required}
                        disabled={field.name === "select_volunteer" && volunteerId}
                        error={errors[field.name as keyof FormData]}
                    />
                ))}
                <AvailableSlots
                    availableSlots={availableSlots}
                    selectedSlot={formData.selected_slot || ""}
                    onSlotSelect={handleSlotSelection}
                    errors={errors.selected_slot || ""}
                    slotError={slotError}
                    fetchingSlots={fetchingSlots}
                />
                {LearnerScheduleModalDescriptionConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...getFieldProps(field)}
                        onChange={(value: any) => handleChange(field.name, value)}
                        value={formData[field.name as keyof FormData]}
                        required={field.required}
                        error={errors[field.name as keyof FormData]}
                    />
                ))}
            </div>
        </SideModal>
    );
}
