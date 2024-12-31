import nationalities from "@/data/nationalities.json"

export const VolunteerFilterModalConstants = [
    {
        id: "country",
        name: "country",
        label: "Select Nationality",
        inputType: "select",
        placeholder: "Select Nationality",
        options: nationalities,
        showSearch: true,
        required: true,
    },
    {
        name: "languages_known",
        label: "Languages Known",
        inputType: "async-select",
        variant: "multi",
        placeholder: "Select Language",
        endpoint: "languages",
        responseAsLabel: "language_name",
        responseAsValue: "language_id",
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
        responseAsValue: "subject_id",
        variant: "multi",
    },
    {
        name: "available_time",
        label: "Available Time",
        inputType: "timerange",
        placeholder: "Available Time",
        required: true,
    },
    {
        name: "available_days",
        label: "Available range of days",
        inputType: "daterange",
        required: true,
    }
];