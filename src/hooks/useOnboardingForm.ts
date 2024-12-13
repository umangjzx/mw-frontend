import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { endpoints } from "@/api/constants";
import { useSendData } from "./useReactQuery";
import { PUT_API } from "@/api/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// const volunteerData: Volunteer = {
//     volunteer_description: "some description",
//     volunteer_education: "some education",
//     volunteer_first_name: "Iwin",
//     volunteer_last_name: "T",
//     volunteer_birth_date: "2024-12-25T18:30:00.000Z",
//     volunteer_parent_email: "iwinissacofficial@gmail.com",
//     volunteer_gender: "male",
//     volunteer_higher_education: "bachelors",
//     volunteer_languages: [
//         {
//             language_name: "Abkhazian",
//             language_id: "734e54d6-8762-4604-bae6-64d0bde4e0c1",
//         },
//     ],
//     education_details: "sqs",
//     volunteer_experience: "dwdwd",
//     consented_from_parent: true,
//     volunteer_skills: [
//         {
//             skill_name: "bdcbe9a0-3c68-4374-b7d1-5203cb8cbf25",
//             skill_id: "Guitar tuning",
//         },
//     ],
//     volunteer_contact_details: {
//         email: "iwinissacofficial@gmail.com",
//         contact_number: {
//             number: "9384913517",
//             country_code: "+91",
//         },
//         zip_code: "638451",
//     },
//     legal_and_safety_info: {
//         criminal_background_check_details: {
//             convicted_of_a_felony: false,
//             involved_in_criminal_activity: false,
//             convicted_of_a_crime: false,
//             description: "criminal_background_check_details",
//         },
//         sex_offender_check_details: {
//             checked_for_sex_offender: false,
//             description: "sex_offender_check_details",
//         },
//         disciplinary_check_details: {
//             terminated_from_volunteer_position: false,
//             involved_in_disputes: false,
//             dismissed_from_institution: false,
//             description: "disciplinary_check_details",
//         },
//         health_and_safety_check_details: {
//             having_health_issues: false,
//             description: "health_and_safety_check_details",
//         },
//         other_consents_details: {
//             consent_to_background_checks: false,
//             agree_to_follow_organization_policies: false,
//             agree_to_understand_termination_of_volunteer_agreement: false,
//             description: "other_consents_details",
//         },
//         volunteer_experience_details: {
//             previously_volunteered: false,
//             invloved_in_complaints: false,
//             description: "volunteer_experience_details",
//         },
//     },
//     profile_picture: {
//         image_url: "image_url",
//         image_id: "image_id",
//     },
//     profile_video: {
//         video_url: "video_url",
//         video_id: "video_id",
//     },
//     profile_document: {
//         document_url: "document_url",
//         document_id: "document_id",
//     },
//     volunteer_subjects: [
//         {
//             subject_name: "Mathematics",
//             subject_id: "44b87f07-d623-47e2-b8c7-a895aa5369eb",
//         },
//     ],
//     consent_and_permissions: {
//         photo_or_video_consent: true,
//         acknowledgement_of_program_policies: true,
//     },
// };

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
        defaultValues: role === "volunteer" ? {} : learnerData,
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
