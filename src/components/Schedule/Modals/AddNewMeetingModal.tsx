"use client";
import { endpoints } from "@/api/constants";
import { Input } from "@/components/common/Input";
import SideModal from "@/components/common/Modals/SideModal";
import { LearnerScheduleModalConstants } from "@/constants/schedule";
import { useState, useEffect } from "react";
import moment from "moment";
import { GET_API, POST_API } from "@/api/request";
import { Radio } from "antd";

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

const AddNewMeetingModal: React.FC<AddNewMeetingModalProps> = ({ isOpen, onClose }) => {
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

    // Fetch volunteers when modal opens
    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await GET_API(endpoints.volunteer.getAllVolunteers);
                console.log(response, "response volunteers");
                const volunteerOptions = response.data.items.map((volunteer: any) => ({
                    label: volunteer.volunteer_first_name + " " + volunteer.volunteer_last_name, // Adjust according to your API response structure
                    value: volunteer.volunteer_id,
                }));
                setVolunteers(volunteerOptions);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
            }
        };

        if (isOpen) {
            fetchVolunteers();
        }
    }, [isOpen]);

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
                    />
                ))}
                {availableSlots.length > 0 ? (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Available Slots:</p>
                        <Radio.Group
                            size="small"
                            onChange={(e) => {
                                const selectedSlot = availableSlots.find(
                                    (slot) => slot.volunteer_slot_id === e.target.value
                                );
                                if (selectedSlot) {
                                    handleSlotSelection(
                                        e.target.value,
                                        selectedSlot.start_time,
                                        selectedSlot.end_time
                                    );
                                }
                            }}
                            value={formData.selected_slot}
                        >
                            <div className="flex gap-3 flex-wrap">
                                {availableSlots.map((slot) => (
                                    <Radio
                                        key={slot.volunteer_slot_id}
                                        value={slot.volunteer_slot_id}
                                        className="text-sm !text-[#16A34A] font-medium underline whitespace-nowrap"
                                    >
                                        {`${slot.start_time} - ${slot.end_time}`}
                                    </Radio>
                                ))}
                            </div>
                        </Radio.Group>
                    </div>
                ) : (
                    <p className="text-xs font-normal mb-2 text-gray-400">
                        To see available slots, select a volunteer and date.
                    </p>
                )}
            </div>
        </SideModal>
    );
};

export default AddNewMeetingModal;
