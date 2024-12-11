export const LearnerProfileFormConstants: FormField[] = [
    {
        name: "username",
        label: "Username",
        inputType: "text",
        placeholder: "John Smith",
        disabled: true,
    },
    {
        name: "profileImage",
        label: "Image",
        inputType: "upload",
        variant: "profile-image",
    },
    {
        name: "bio",
        label: "Bio",
        inputType: "textarea",
        placeholder: "Tell us about yourself...",
    },
    {
        name: "location",
        label: "Location",
        inputType: "select",
        placeholder: "Select Location",
    },
    {
        name: "subjectsTeach",
        label: "Subjects I Teach",
        inputType: "multiselect",
        placeholder: "Search and Select",
        options: [
            { label: "Music", value: "music" },
            { label: "Math", value: "math" },
            { label: "Physics", value: "physics" },
            // Add more subjects as needed
        ],
    },
    {
        name: "languagesSpoken",
        label: "Languages Spoken",
        inputType: "multiselect",
        placeholder: "Search and Select",
        options: [
            { label: "English", value: "english" },
            { label: "Spanish", value: "spanish" },
            { label: "French", value: "french" },
            // Add more languages as needed
        ],
    },
    {
        name: "skills",
        label: "Skills",
        inputType: "multiselect",
        placeholder: "Search and Select",
        options: [
            { label: "Music Therapy", value: "music_therapy" },
            { label: "Early Childhood Education", value: "early_childhood_education" },
            { label: "Language Development", value: "language_development" },
            { label: "Art Therapy", value: "art_therapy" },
            { label: "Behavioral Support", value: "behavioral_support" },
            // Add more skills as needed
        ],
    },
];
