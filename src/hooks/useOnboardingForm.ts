import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { endpoints } from "@/api/constants";
import { useSendData } from "./useReactQuery";
import { PUT_API } from "@/api/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { defaultVolunteerData } from "@/components/onboarding/FormSection/config";



const learnerData = {
    learner_personal_info: {
        learner_first_name: "Iwin",
        learner_last_name: "T",
        learner_date_of_birth: "2024-12-25T18:30:00.000Z",
        learner_gender: "male",
        learner_preferred_pronoun: "he/him",
        learner_primary_language: "English",
        learner_contact_details: {
            email: "iwinissacofficial@gmail.com",
            contact_number: {
                number: "9384913517",
                country_code: "+91",
            },
        },
    },
    parent_info: {
        parent_first_name: "Test",
        parent_last_name: "Test",
        parent_email: "test@gmail.com",
        relationship_to_learner: "father",
        parent_contact_number: {
            number: "9384913517",
            country_code: "+91",
        },
        emergency_contact_number: {
            number: "9384913517",
            country_code: "+91",
        },
        parent_address: "address",
    },

    learner_special_needs: {
        type_of_developmental_disability: "type_of_developmental_disability",
        level_of_support_needed: "moderate",
        assistive_device_used: "assistive_device_used",
        communication_style: "communication_style",
        description: "description",
        areas_of_support_needed: ["areas_of_support_needed"],
        learning_styles: ["learning_styles"],
    },

    education: {
        current_school: "current_school",
        iep_plan_key: "iep_plan_key",
        academic_strengths: ["academic_strengths"],
        academic_challenges: ["academic_challenges"],
    },

    social_skills: {
        communication_preferences: ["communication_preferences"],
        social_interaction_styles: ["social_interaction_styles"],
        behavioral_concerns: ["behavioral_concerns"],
        techniques_to_calm: ["techniques_to_calm"],
    },

    current_interests: {
        interests: ["interests"],
        extra_curricular_activities: ["extra_curricular_activities"],
        favorite_activities: ["favorite_activities"],
    },

    learner_goals: {
        expected_goals: ["expected_goals"],
        subjects_to_focus_on: ["subjects_to_focus_on"],
        preferred_volunteer_qualities: ["preferred_volunteer_qualities"],
        skill_level: "beginner",
    },

    additional_info: {
        cultural_consideration: "cultural_consideration",
        other_concerns_or_requests: "other_concerns_or_requests",
        what_motivates_to_learn: "what_motivates_to_learn",
    },
    consent_and_permissions: {
        photo_or_video_consent: true,
        acknowledgement_of_program_policies: true,
    },
};

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
                : learnerData,
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
