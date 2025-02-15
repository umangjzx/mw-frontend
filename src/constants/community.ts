import { z } from "zod";

export const CommunityFormConstants: FormField[] = [
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
        inputType: "upload",
        maxFiles: 5,
        // fileType: "image/*",
    },
];

export const CommunityFormSchema = z.object({
    resource_image: z
        .object({
            image_url: z.string(),
            image_id: z.string()
        })
        .or(z.undefined())
        .refine((value) => value, {
            message: "Please upload a single cover image.",
        }),
    resource_title: z
        .string({ required_error: "Resource Title is required" })
        .min(3, "Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    description: z
        .string({ required_error: "Description is required" })
        .min(3, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
});

export const PostFormSchema = z.object({
    notes: z
        .string({ required_error: "Notes are required" })
        .min(1, "Notes are required")
        .max(1000, "Notes cannot exceed 1000 characters"),
    uploadPictures: z
        .array(z.any())
        .min(1, "Please upload at least one picture")
        .max(5, "Maximum 5 pictures allowed"),
});

export const CommunityTabs = [
    {
        name: "All Posts",
        route: null,
    },
    // {
    //     name: "Suggested For You",
    //     route: "suggested_for_you",
    // },
    {
        name: "Your Notifications",
        route: "your_notifications",
    },
    {
        name: "Saved Posts",
        route: "saved_posts",
    },
    {
        name: "Manage Your Posts",
        route: "manage_your_posts",
    },
];

export const getCurrentTab = (currentTab: string | null) => {
    return CommunityTabs.find((tab) => tab.route === currentTab);
};
