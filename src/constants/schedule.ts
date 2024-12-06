import { FormField } from "@/components/common/Input/input";

export const alertModalConstants = {
    title: "Alert!",
    content:
        "Canceling a scheduled meeting less than 6 hours in advance can impact your credibility as a volunteer. Please notify us at least 6 hours before the meeting if you need to reschedule or cancel.",
    placeholder: "Add notes here",
    rows: 6,
};

export const LearnerFeedbackFormConstants: FormField[] = [
    {
        name: "classDuration",
        label: "How long was the class?",
        inputType: "text",
        contentType: "number",
        placeholder: "Enter the duration of the class",
        sublabel: "(In hrs)",
        sublabelAlignment: "right",
    },
    {
        name: "rating",
        label: "Focus/ Interest level of the student",
        inputType: "radio",
        variant: "rating",
        options: [
            { label: "Bad", value: "1" },
            { label: "Normal", value: "2" },
            { label: "Good", value: "3" },
            { label: "Very Good", value: "4" },
            { label: "Excellent", value: "5" },
        ],
        inputClassName: "justify-between p-2",
    },
    {
        name: "notes",
        label: "Your comments",
        inputType: "textarea",
        placeholder: "Enter comments here",
    },
    {
        name: "uploadPictures",
        label: "Do you want to upload any pictures to share in the community/forum?",
        inputType: "image-upload",
        maxFiles: 5,
    },
];
