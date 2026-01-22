"use client";

import { useState } from "react";
import CenterModal from "@/components/common/Modals/CenterModal";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import TagComponent from "@/components/common/Tag";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: NewEventData) => void;
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

export default function NewEventModal({ isOpen, onClose, onSubmit }: NewEventModalProps) {
    const [formData, setFormData] = useState<NewEventData>({
        select_date: new Date(),
        duration: "",
        start_time: "",
        title: "",
        description: "",
        tags: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);

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

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
        // Reset form
        setFormData({
            select_date: new Date(),
            duration: "",
            start_time: "",
            title: "",
            description: "",
            tags: [],
        });
        setSelectedTime(null);
        setTagInput("");
        onClose();
    };

    const handleCancel = () => {
        // Reset form
        setFormData({
            select_date: new Date(),
            duration: "",
            start_time: "",
            title: "",
            description: "",
            tags: [],
        });
        setSelectedTime(null);
        setTagInput("");
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
            bodyClassName="!px-6 !py-6"
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
                        <label className="text-base font-medium text-[#121212]">Start Time (IST)</label>
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
                        inputClassName="w-full !text-base !text-[#121212] placeholder:!text-[#808080] placeholder:!text-base"
                        rows={4}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col ">
                    <label className="text-base font-medium text-[#121212]">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag, index) => (
                            <TagComponent
                                key={index}
                                text={tag}
                                isClose={true}
                                onClose={() => handleRemoveTag(tag)}
                            />
                        ))}
                    </div>
                    <Input
                        name="tag_input"
                        inputType="text"
                        value={tagInput}
                        onChange={(value: string | string[]) => {
                            setTagInput(Array.isArray(value) ? value[0] : value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        placeholder="Add tags here"
                        inputClassName="w-full !h-12 placeholder:!text-[#808080] placeholder:!text-base"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-5 mt-2 border-t border-stroke">
                    <Button
                        title="Cancel"
                        onClick={handleCancel}
                        customClassName="!bg-white !text-black !font-medium rounded-full !px-6 !py-2.5"
                    />
                    <Button
                        title="Create Event"
                        onClick={handleSubmit}
                        customClassName="!bg-black !text-white !font-medium rounded-full !px-6 !py-2.5"
                    />
                </div>
            </div>
        </CenterModal>
    );
}
