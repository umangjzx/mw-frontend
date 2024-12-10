import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const useOnboardingForm = (schema: any) => {
    const role = localStorage.getItem("role");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            // Add other default values as needed based on your schema
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        alert("Form submitted");
        // Add your API call here
        try {
            console.log("Form data:", data);
            // Add your API call here
        } catch (error) {
            console.error("Error submitting form:", error);
            throw error;
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
