import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { endpoints } from "@/api/constants";
import { useSendData } from "./useReactQuery";
import { PUT_API } from "@/api/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { defaultVolunteerData } from "@/components/onboarding/FormSection/config";


export const useOnboardingForm = (schema: any) => {
    const role = Cookies.get("role");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues:
            role === "volunteer"
                ? {
                      ...defaultVolunteerData,
                      volunteer_contact_details: {
                          ...defaultVolunteerData?.volunteer_contact_details,
                          email: "",
                      },
                  }
                : {},
    });
    const router = useRouter();

    const { mutate: updateOnboarding, isPending } = useSendData({
        fn: (data: z.infer<typeof schema>) =>
            PUT_API(endpoints.onboarding.update(role as "volunteer" | "learner"), data),
        success: () => {
            router.push("/onboarding/verification");
        },
        error: () => {
            alert("Error submitting form");
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            updateOnboarding(data);
            console.log("FORM_DATA", data);
        } catch (error) {
            console.error("Error submitting form:", error);
            throw error;
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isPending,
    };
};
