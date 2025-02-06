import { z } from "zod";
import nationalities from "@/data/nationalities.json"

export const VolunteerProfileFormSchema = z.object({
    volunteer_first_name: z.string({ required_error: "First Name is required" }).min(1, "First Name  is required"),
    volunteer_last_name: z.string({ required_error: "Last Name is required" }).min(1, "Last Name  is required"),
    profile_picture: z
        .object({
            image_url: z.string(),
            image_id: z.string(),
        })
        .or(z.undefined())
        .refine((value) => value, {
            message: "Please upload a single cover image.",
        }),
    volunteer_description: z
        .string({ required_error: "Bio is required" })
        .min(1, "Bio is required"),
    country: z.string({ required_error: "Country selection is required" }).min(1, "Country selection is required"),
    volunteer_subjects: z
        .array(z.any(), { required_error: "At least one subject is required" })
        .min(1, "At least one subject is required"),
    volunteer_languages: z
        .array(z.any(), { required_error: "At least one language is required" })
        .min(1, "At least one language is required"),
    volunteer_skills: z
        .array(z.any(), { required_error: "At least one skill is required" })
        .min(1, "At least one skill is required"),
});

export const VolunteerProfileFormConstants: FormField[] = [
    {
        name: "volunteer_first_name",
        label: "First Name",
        inputType: "text",
        placeholder: "Eg. Walter",
        gridCols: 1,
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "volunteer_last_name",
        label: "Last Name",
        inputType: "text",
        placeholder: "Eg. White",
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "profile_picture",
        fileType: "image/*",
        label: "ProfileImage",
        required: true,
        inputType: "upload",
        variant: "profile-image",
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "volunteer_description",
        label: "Bio",
        inputType: "textarea",
        placeholder: "Tell us about yourself...",
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "volunteer_languages",
        label: "Languages Spoken",
        inputType: "async-select",
        variant: "multi",
        placeholder: "English, Tamil...",
        endpoint: "languages",
        responseAsLabel: "language_name",
        responseAsValue: ["language_id", "language_name"],
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "volunteer_subjects",
        label: "Subjects I Teach",
        inputType: "async-select",
        placeholder: "Select Subjects",
        creatable: true,
        variant: "multi",
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
        endpoint: "subjects",
        responseAsLabel: "subject_name",
        responseAsValue: ["subject_id", "subject_name"],
    },
    {
        name: "volunteer_skills",
        label: "Skills",
        inputType: "async-select",
        placeholder: "Select skills",
        creatable: true,
        endpoint: "skills",
        responseAsLabel: "skill_name",
        responseAsValue: ["skill_id", "skill_name"],
        variant: "multi",
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
    {
        name: "country",
        label: "Country",
        inputType: "select",
        placeholder: "Select Country",
        options: nationalities,
        showSearch: true,
        required: true,
        rootClassName: "max-md:bg-white max-md:p-4 max-md:rounded-xl",
    },
];
