export const TestimonialFormConstants: FormField[] = [
    {
        name: "comments",
        label: "Your Comments",
        inputType: "textarea",
        placeholder: "Enter comments here",
    },
    {
        name: "uploadPictures",
        label: "Do you want to upload any pictures to share in the community/forum?",
        inputType: "image-upload",
        maxFiles: 3,
    },
];

export const MessageModalConstants: FormField[] = [
    {
        name: "message",
        inputType: "textarea",
        placeholder: "Type message here",
        rows: 10,
    },
];
