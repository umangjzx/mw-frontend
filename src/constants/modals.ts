
export const VolunteerFilterModalConstants = [
    {
        name: "nationality",
        label: "Select Nationality",
        inputType: "select",
        placeholder: "Select Nationality",
        required: true,
        options: [
            { label: "Indian", value: "indian" },
            { label: "American", value: "american" }
        ]
    },
    {
        name: "languages_known",
        label: "Languages Known",
        inputType: "async-select",
        variant: "multi",
        placeholder: "Select Language",
        endpoint: "languages",
        responseAsLabel: "language_name",
        responseAsValue: ["language_id", "language_name"],
        required: true,
    },
    {
        name: "subjects",
        label: "Subjects",
        inputType: "async-select",
        placeholder: "Select Subjects",
        required: true,
        endpoint: "subjects",
        responseAsLabel: "subject_name",
        responseAsValue: ["subject_id", "subject_name"],
        variant: "multi",
    },
    {
        name: "available_time",
        label: "Available Time",
        inputType: "timerange",
        placeholder: "Available Time",
        required: true,
        responseAsLabel: "available_time",
        responseAsValue: ["subject_id", "subject_name"],
    },
    {
        name: "available_days",
        label: "Available range of days",
        inputType: "daterange",
        required: true,
    }
];