import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { endpoints } from "@/api/constants";
import { useSendData } from "./useReactQuery";
import { PUT_API } from "@/api/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import { useAppStore } from "@/store/useAppStore";

export const useOnboardingForm = (schema: any) => {
    const role = Cookies.get("role");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });
    const router = useRouter();
    const { setImageId, setVideoId, setDocumentId } = useAppStore();

    const { mutate: updateOnboarding, isPending } = useSendData({
        fn: (data: z.infer<typeof schema>) =>
            PUT_API(endpoints.onboarding.update(role as "volunteer" | "learner"), data),
        success: () => {
            showToast({ type: "success", message: "Form Submitted!" });
            router.push("/onboarding/verification");
            setImageId(null);
            setVideoId(null);
            setDocumentId(null);
        },
        error: () => {
            showToast({ type: "error", message: "Fill required Fields!" });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            // updateOnboarding(data);
            console.log("FORM_DATA", data);
        } catch (error) {
            console.error("Error submitting form:", error);
            showToast({ type: "error", message: "Fill required Fields!" });
            throw error;
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isPending,
    };
};
