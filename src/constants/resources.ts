export const ResourceFormConstants: FormField[] = [
    {
        name: "coverImage",
        label: "Add Cover Image",
        inputType: "image-upload",
        maxFiles: 1,
        variant: "cover",
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
        inputType: "multiselect",
        placeholder: "Select the skills",
    },
    {
        name: "category",
        label: "Select Category",
        inputType: "select",
        placeholder: "Select category",
    },
    {
        name: "notes",
        label: "Add Notes",
        inputType: "textarea",
        placeholder: "Enter notes here",
    },
];
