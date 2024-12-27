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
        inputType: "upload",
        maxFiles: 5,
        // fileType: "image/*",
    },
];

export const CommunityTabs = [
    {
        name: "All Posts",
        route: null,
    },
    {
        name: "Suggested For You",
        route: "suggested_for_you",
    },
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
