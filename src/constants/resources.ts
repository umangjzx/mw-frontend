import { endpoints } from "@/api/constants";
export const ResourceFormConstants: FormField[] = [
    {
        name: "coverImage",
        label: "Add Cover Image",
        inputType: "upload",
        maxFiles: 1,
    },
    {
        name: "title",
        label: "Title",
        inputType: "text",
        placeholder: "Enter title name",
    },
    {
        name: "by",
        label: "By",
        inputType: "text",
        placeholder: "John Doe",
        disabled: true,
    },
    {
        name: "level",
        label: "Select Level",
        inputType: "radio",
        options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Expert", value: "expert" },
        ],
    },
    {
        name: "description",
        label: "Description",
        inputType: "textarea",
        placeholder: "Enter description",
    },
    {
        name: "skills",
        label: "Skills you gain (Optional)",
        inputType: "async-select",
        placeholder: "Select the skills",
        endpoints: "skills",
        variant: "multi",
        responseAsLabel: "skill_name",
        responseAsValue: ["skill_id", "skill_name"],
    },
    {
        name: "category",
        label: "Select Category",
        inputType: "async-select",
        placeholder: "Select category",
        endpoints: "categories",
        variant: "single",
        responseAsLabel: "category_name",
        responseAsValue: "category_id",
    },
    {
        name: "notes",
        label: "Add Notes",
        inputType: "textarea",
        placeholder: "Enter notes here",
    },
];
