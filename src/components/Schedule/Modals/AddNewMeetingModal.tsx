"use client";
import Button from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import SideModal from "@/components/common/Modals/SideModal";
import { LearnerScheduleModalConstants } from "@/constants/schedule";
import { useState } from "react";

interface FormData {
    title_of_the_meeting: string;
    select_volunteer: string;
    select_date: string;
    select_time: string;
    google_meet_link: string;
    description: string;
}
const AddNewMeetingModal: React.FC<AddNewMeetingModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        title_of_the_meeting: "",
        select_volunteer: "",
        select_date: "",
        select_time: "",
        google_meet_link: "",
        description: "",
    });

    console.log(formData, "formData side");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e?.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <SideModal title="Add New Meeting" onClose={onClose} isOpen={isOpen}>
            <div className="flex flex-col px-5 mt-7">
                {LearnerScheduleModalConstants.map((field: any) => (
                    <Input key={field.name} {...field} onChange={handleChange} />
                ))}
                <div className="flex flex-col gap-2">
                    <p className="text-sm ">Meeting link</p>
                    <Button className="w-full !text-black text-sm border-none !rounded-xl !bg-background-secondary">
                        Add Google Meet Video Conferencing
                    </Button>
                </div>
            </div>
        </SideModal>
    );
};

export default AddNewMeetingModal;
