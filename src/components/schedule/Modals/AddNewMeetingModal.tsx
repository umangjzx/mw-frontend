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

interface FormData {
    title_of_the_meeting: string;
    select_volunteer: string;
    select_date: string | Date;
    start_time: string;
    end_time: string;
    google_meet_link: string;
    description: string;
    selected_slot?: string;
}

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Check for date selection and if we have a selected volunteer
        if (name === "select_date" && value && formData.select_volunteer) {
            const formattedDate = moment(value).format("YYYY-MM-DD");
            try {
                const response = await GET_API(
                    endpoints.volunteer_slot.availableSlots(
                        formData.select_volunteer,
                        formattedDate
                    )
                );
                setAvailableSlots(response.data.slots);
            } catch (error) {
                setAvailableSlots([]);
                console.error("Error fetching available slots:", error);
            }
        }

        // When volunteer is selected and we already have a date, fetch available slots
        if (name === "select_volunteer" && value && formData.select_date) {
            const formattedDate = moment(formData.select_date).format("YYYY-MM-DD");
            try {
                const response = await GET_API(
                    endpoints.volunteer_slot.availableSlots(value, formattedDate)
                );
                setAvailableSlots(response.data.slots);
            } catch (error) {
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
        console.log(slotId, startTime, endTime, "slotId, startTime, endTime");
        setFormData((prev) => ({
            ...prev,
            selected_slot: slotId,
            start_time: startTime,
            end_time: endTime,
        }));
    };

    const handleSave = () => {
        const payload = {
            volunteer_id: formData.select_volunteer,
            volunteer_slot_id: formData.selected_slot,
            session_date: moment(formData.select_date).format("YYYY-MM-DD"),
            session_start_time: formData.start_time,
            session_end_time: formData.end_time,
            session_title: formData.title_of_the_meeting,
            session_description: formData.description,
        };
        POST_API(endpoints.session.bookSession, payload)
            .then((res) => {
                console.log(res, "res");
                // Reset form
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
                queryClient.invalidateQueries({ queryKey: ["events"] });
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    return (
        <SideModal title="Add New Meeting" onClose={onClose} isOpen={isOpen} onSave={handleSave}>
            <div className="flex flex-col px-5 mt-7">
                {LearnerScheduleModalConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...getFieldProps(field)}
                        onChange={(value: any) => handleChange(field.name, value)}
                        value={formData[field.name as keyof FormData]}
                        required={field.required}
                        disabled={field.name === "select_volunteer" && volunteerId}
                    />
                ))}
                <AvailableSlots
                    availableSlots={availableSlots}
                    selectedSlot={formData.selected_slot || ""}
                    onSlotSelect={handleSlotSelection}
                />
                {LearnerScheduleModalDescriptionConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...getFieldProps(field)}
                        onChange={(value: any) => handleChange(field.name, value)}
                        value={formData[field.name as keyof FormData]}
                        required={field.required}
                    />
                ))}
            </div>
        </SideModal>
    );
}
