"use client";

import { useState } from "react";
import CenterModal from "@/components/common/Modals/CenterModal";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import TagComponent from "@/components/common/Tag";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { POST_API, GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { showToast } from "@/components/common/Toast";
import { useQuery } from "@tanstack/react-query";

interface Skill {
    skill_id: string;
    skill_name: string;
}

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: NewEventData) => void;
    /** When provided, used for the instant session. When omitted, slots for the selected date are fetched and the first slot is used. */
    volunteer_slot_id?: string;
}

export interface NewEventData {
    select_date: Date | null;
    duration: string;
    start_time: string;
    title: string;
    description: string;
    tags: string[];
}

const durationOptions = [
    { label: "15 mins", value: "15" },
    { label: "30 mins", value: "30" },
    { label: "45 mins", value: "45" },
    { label: "1 hour", value: "60" },
    { label: "1.5 hours", value: "90" },
    { label: "2 hours", value: "120" },
];

/** Request body for POST /api/v1/session/instant_session */
interface InstantSessionPayload {
    volunteer_slot_id: string;
    date: string;
    duration: number;
    start_time: string;
    title: string;
    description: string;
    tag_ids: string[];
}

export default function NewEventModal({
    isOpen,
    onClose,
    onSubmit,
    volunteer_slot_id: volunteerSlotIdProp,
}: NewEventModalProps) {
    const [formData, setFormData] = useState<NewEventData>({
        select_date: new Date(),
        duration: "",
        start_time: "",
        title: "",
        description: "",
        tags: [],
    });

    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [skillSelectValue, setSkillSelectValue] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: skillsData } = useQuery({
        queryKey: ["common-skills"],
        queryFn: async () => {
            const res = await GET_API(endpoints.common("skills"));
            return res?.data as Skill[];
        },
        enabled: isOpen,
    });
    const skills: Skill[] = Array.isArray(skillsData) ? skillsData : [];
    const skillOptions = skills.map((s) => ({ label: s.skill_name, value: s.skill_id }));

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => dayjs().format("YYYY-MM-DD");

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, select_date: date }));
    };

    const handleDurationChange = (value: string | number) => {
        setFormData((prev) => ({ ...prev, duration: String(value) }));
    };

    const handleTimeChange = (time: dayjs.Dayjs | null) => {
        setSelectedTime(time);
        if (time) {
            setFormData((prev) => ({ ...prev, start_time: time.format("HH:mm") }));
        }
    };

    const handleTitleChange = (value: string | string[]) => {
        setFormData((prev) => ({ ...prev, title: Array.isArray(value) ? value[0] : value }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleAddSkill = (skillId: string) => {
        const skill = skills.find((s) => s.skill_id === skillId);
        if (skill && !selectedSkills.some((s) => s.skill_id === skillId)) {
            setSelectedSkills((prev) => [...prev, skill]);
            setSkillSelectValue("");
        }
    };

    const handleRemoveSkill = (skillId: string) => {
        setSelectedSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
    };

    const handleSubmit = async () => {
        if (!formData.duration || !formData.start_time || !formData.title?.trim()) {
            showToast({ message: "Please fill in duration, start time and title", type: "error" });
            return;
        }
        const dateStr = formData.select_date
            ? dayjs(formData.select_date).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD");
        let volunteer_slot_id = volunteerSlotIdProp;
        if (!volunteer_slot_id) {
            try {
                const res = await GET_API(
                    endpoints.volunteer_slot.getAvailableDaysForDate(dateStr)
                );
                const slots = res?.data?.slots ?? [];
                volunteer_slot_id = slots[0]?.volunteer_slot_id;
                if (!volunteer_slot_id) {
                    showToast({
                        message: "No volunteer slot found for this date. Add availability first.",
                        type: "error",
                    });
                    return;
                }
            } catch {
                showToast({ message: "Could not load slots for this date", type: "error" });
                return;
            }
        }
        const payload: InstantSessionPayload = {
            volunteer_slot_id,
            date: dateStr,
            duration: Number(formData.duration) || 0,
            start_time: formData.start_time,
            title: formData.title.trim(),
            description: formData.description?.trim() ?? "",
            tag_ids: selectedSkills.map((s) => s.skill_id),
        };
        setIsSubmitting(true);
        try {
            const res = await POST_API(endpoints.session.createInstantSession, payload);
            if (res?.status === 200 || res?.status === 201) {
                showToast({ message: "Event created successfully", type: "success" });
                onSubmit?.({ ...formData, tags: selectedSkills.map((s) => s.skill_name) });
                setFormData({
                    select_date: new Date(),
                    duration: "",
                    start_time: "",
                    title: "",
                    description: "",
                    tags: [],
                });
                setSelectedSkills([]);
                setSkillSelectValue("");
                setSelectedTime(null);
                onClose();
            } else {
                showToast({ message: "Failed to create event", type: "error" });
            }
        } catch {
            showToast({ message: "Failed to create event", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            select_date: new Date(),
            duration: "",
            start_time: "",
            title: "",
            description: "",
            tags: [],
        });
        setSelectedSkills([]);
        setSkillSelectValue("");
        setSelectedTime(null);
        onClose();
    };

    return (
        <CenterModal
            title="New Event"
            isOpen={isOpen}
            onClose={handleCancel}
            width={620}
            hideFooter={true}
            customClassName="!rounded-3xl"
            rootClassName="!rounded-3xl overflow-hidden"
            headerClassName="!px-6 !py-5"
            bodyClassName="!px-6 "
        >
            <div className="flex flex-col gap-2">
                {/* Select Date */}
                <div className="flex flex-col gap-2">
                    <Input
                        name="select_date"
                        label="Select Date"
                        inputType="datepicker"
                        value={formData.select_date}
                        onChange={handleDateChange}
                        disabled={true}
                        format="DD MMMM YYYY"
                        labelClassName="!text-base !text-[#121212]"
                        inputClassName="w-full !h-12 !bg-[#E0E0E0] !border-[#E0E0E0] hover:!bg-[#E0E0E0] hover:!border-[#E0E0E0] focus:!bg-[#E0E0E0] focus:!border-[#E0E0E0] [&_.ant-picker]:!bg-[#E0E0E0] [&_.ant-picker]:!border-[#E0E0E0] [&_.ant-picker-input>input]:!bg-[#E0E0E0] [&_.ant-picker-input>input]:!text-[#121212] [&_.ant-picker-input>input]:!text-base [&_.ant-picker-suffix]:!text-[#4F4F4F] [&_.ant-picker-suffix_svg]:!text-[#4F4F4F] [&_.ant-picker-suffix_svg]:!fill-[#4F4F4F] [&_.ant-picker-suffix_span]:!text-[#4F4F4F] [&_.ant-picker-suffix_span_svg]:!text-[#4F4F4F] [&_.ant-picker-suffix_span_svg]:!fill-[#4F4F4F]"
                        availableDates={
                            formData.select_date
                                ? [dayjs(formData.select_date).format("YYYY-MM-DD")]
                                : [getTodayDate()]
                        }
                    />
                </div>

                {/* Duration and Start Time Row */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Duration */}
                    <div className="flex flex-col gap-2">
                        <Input
                            name="duration"
                            label="Duration"
                            inputType="select"
                            value={formData.duration}
                            onChange={handleDurationChange}
                            options={durationOptions}
                            placeholder="Select Duration"
                            labelClassName="!text-base !text-[#121212]"
                            inputClassName="w-full !h-12 [&_.ant-select-selector]:!text-base [&_.ant-select-selector]:!text-[#121212] [&_.ant-select-selection-placeholder]:!text-[#808080] [&_.ant-select-selection-placeholder]:!text-base [&_.ant-select-selection-placeholder]:!font-normal [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!text-[#808080] [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!text-base [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!font-normal"
                        />
                    </div>

                    {/* Start Time */}
                    <div className="flex flex-col gap-2">
                        <label className="text-base font-medium text-[#121212]">
                            Start Time (IST)
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                timeSteps={{ minutes: 15 }}
                                format="h:mm A"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                slotProps={{
                                    textField: {
                                        placeholder: "Select Time",
                                        sx: {
                                            width: "100%",
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                height: "48px",
                                                backgroundColor: "#f4f7fb",
                                                "& fieldset": {
                                                    border: "1px solid #e0e0e0",
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#f4f7fb",
                                                    "& fieldset": {
                                                        border: "1px solid #e0e0e0",
                                                    },
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#f4f7fb",
                                                    "& fieldset": {
                                                        border: "1px solid #e0e0e0",
                                                    },
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                padding: "4px 11px",
                                                fontSize: "14px",
                                                color: "#1a1a1a",
                                                height: "48px",
                                                display: "flex",
                                                alignItems: "center",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                color: "#808080",
                                                opacity: 1,
                                                fontSize: "16px",
                                                fontWeight: 400,
                                            },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <Input
                        name="title"
                        label="Title"
                        inputType="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Enter title here"
                        labelClassName="!text-base !text-[#121212]"
                        inputClassName="w-full !h-12 !text-base !text-[#121212] placeholder:!text-[#808080] placeholder:!text-base"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <Input
                        name="description"
                        label="Description (Optional)"
                        inputType="textarea"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter description here"
                        labelClassName="!text-base !text-[#121212]"
                        inputClassName="w-full !h-[100px] !text-base !text-[#121212] placeholder:!text-[#808080] placeholder:!text-base"
                        rows={4}
                    />
                </div>

                {/* Tags – search and select from skills, pass skill IDs as tag_ids on post */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-[#121212]">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedSkills.map((skill) => (
                            <TagComponent
                                key={skill.skill_id}
                                text={skill.skill_name}
                                isClose={true}
                                onClose={() => handleRemoveSkill(skill.skill_id)}
                            />
                        ))}
                    </div>
                    <Input
                        name="skill_select"
                        inputType="select"
                        placeholder="Search and select skills"
                        value={skillSelectValue}
                        onChange={(value: string | number) => {
                            const id = String(value);
                            handleAddSkill(id);
                        }}
                        options={skillOptions.filter(
                            (opt) => !selectedSkills.some((s) => s.skill_id === opt.value)
                        )}
                        showSearch={true}
                        inputClassName="w-full !h-12 [&_.ant-select-selector]:!text-base"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-5 pb-2 border-t border-stroke">
                    <Button
                        title="Cancel"
                        onClick={handleCancel}
                        customClassName="!bg-white !text-black !font-medium rounded-full !px-6 !py-2.5"
                    />
                    <Button
                        title={isSubmitting ? "Creating..." : "Create Event"}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        customClassName="!bg-black !text-white !font-medium rounded-full !px-6 !py-2.5"
                    />
                </div>
            </div>
        </CenterModal>
    );
}
