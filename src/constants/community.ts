import { FormField } from "@/components/common/Input/input";

export const LearnerCommunityFormConstants: FormField[] = [
    {
        name: "notes",
        label: "Your comments",
        inputType: "textarea",
        placeholder: "Enter comments here",
        rows: 8,
    },
    {
        name: "uploadPictures",
        label: "Do you want to upload any pictures to share in the community/forum?",
        inputType: "image-upload",
        maxFiles: 5,
    },
];