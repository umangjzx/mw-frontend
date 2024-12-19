import { z } from "zod";

export const volunteerFormSchema = z.object({
    volunteer_first_name: z.string({ required_error: "First Name is required" }),
    volunteer_last_name: z.string({ required_error: "Last Name is required" }),
    volunteer_birth_date: z.string({ required_error: "Please select your birthday" }),
    consented_from_parent: z.boolean({ required_error: "Parent consent is required" }).refine((val) => val === true, { message: "Parent consent must be provided" }),
    volunteer_parent_email: z
        .string({ required_error: "Parent email is required" })
        .email("Please enter a valid email address"),
    volunteer_gender: z.string({ required_error: "Please select your gender" }),
    volunteer_education: z.string({ required_error: "Please provide your education details" }),
    volunteer_higher_education: z.string({
        required_error: "Higher education details are required",
    }),
    volunteer_languages: z
        .array(z.any(), { required_error: "Please specify the languages you know" })
        .nonempty("Please add at least one language"),
    volunteer_experience: z.string({ required_error: "Experience details are required" }),
    volunteer_skills: z
        .array(
            z.object({
                skill_name: z.string({ required_error: "Skill name is required" }),
                skill_id: z.string({ required_error: "Skill ID is required" }),
            }),
            { required_error: "Please add at least one skill" }
        )
        .nonempty("Please add at least one skill"),
    volunteer_description: z.string({ required_error: "Description is required" }),

    // Contact Details validations
    volunteer_contact_details: z.object({
        email: z
            .string({ required_error: "Email is required" })
            .email("Please enter a valid email address"),
        contact_number: z.object({
            number: z.string({ required_error: "Contact number is required" }),
            country_code: z.string({ required_error: "Country code is required" }),
        }),
        zip_code: z.string({ required_error: "Zip code is required" }),
    }),

    // Legal and Safety Info validations
    legal_and_safety_info: z.object({
        criminal_background_check_details: z.object({
            convicted_of_a_felony: z.boolean({
                required_error: "Please specify if you were convicted of a felony",
            }),
            involved_in_criminal_activity: z.boolean({
                required_error: "Please specify if you were involved in criminal activity",
            }),
            convicted_of_a_crime: z.boolean({
                required_error: "Please specify if you were convicted of a crime",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
        sex_offender_check_details: z.object({
            checked_for_sex_offender: z.boolean({
                required_error: "Please specify if you were checked for a sex offender",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
        disciplinary_check_details: z.object({
            terminated_from_volunteer_position: z.boolean({
                required_error: "Please specify if you were terminated from a position",
            }),
            involved_in_disputes: z.boolean({
                required_error: "Please specify if you were involved in disputes",
            }),
            dismissed_from_institution: z.boolean({
                required_error: "Please specify if you were dismissed from an institution",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
        health_and_safety_check_details: z.object({
            having_health_issues: z.boolean({
                required_error: "Please specify if you have health issues",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
        other_consents_details: z.object({
            consent_to_background_checks: z.boolean({
                required_error: "Please confirm your consent to background checks",
            }),
            agree_to_follow_organization_policies: z.boolean({
                required_error: "Please confirm that you agree to follow policies",
            }),
            agree_to_understand_termination_of_volunteer_agreement: z.boolean({
                required_error: "Please confirm that you understand the agreement",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
        volunteer_experience_details: z.object({
            previously_volunteered: z.boolean({
                required_error: "Please specify if you previously volunteered",
            }),
            invloved_in_complaints: z.boolean({
                required_error: "Please specify if you were involved in complaints",
            }),
            description: z.string({ required_error: "Please provide a description" }),
        }),
    }),

    // Consent and Permissions
    consent_and_permissions: z.object({
        photo_or_video_consent: z.boolean({ required_error: "Photo or video consent is required" }),
        acknowledgement_of_program_policies: z.boolean({
            required_error: "Acknowledgement of policies is required",
        }),
    }),

    // Profile Picture
    profile_picture: z.object({
        image_url: z.string({ required_error: "Profile picture URL is required" }),
        image_id: z.string({ required_error: "Profile picture ID is required" }),
    }),

    // Profile Video
    profile_video: z.object({
        video_url: z.string({ required_error: "Profile video URL is required" }),
        video_id: z.string({ required_error: "Profile video ID is required" }),
    }),

    // Profile Document
    profile_document: z.object({
        document_url: z.string({ required_error: "Document URL is required" }),
        document_id: z.string({ required_error: "Document ID is required" }),
    }),

    // Volunteer Subjects
    volunteer_subjects: z
        .array(z.any(), { required_error: "Please add at least one subject" })
        .nonempty("Please add at least one subject"),
});

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

export const learnerFormSchema = z.object({
    // Learner personal info - Required section
    learner_personal_info: z.object({
        learner_first_name: z.string({ required_error: "Learner's First Name is required" }),
        learner_last_name: z.string({ required_error: "Learner's Last Name is required" }),
        learner_date_of_birth: z.any({ required_error: "Learner's Date of Birth is required" }),
        learner_gender: z.string({ required_error: "Learner's Gender is required" }),
        learner_preferred_pronoun: z.string({
            required_error: "Learner's Preferred Pronoun is required",
        }),
        learner_primary_language: z.string({
            required_error: "Learner's Primary Language is required",
        }),
        learner_contact_details: z.object({
            email: z
                .string({ required_error: "Learner's Email is required" })
                .email("Invalid email address"),
            contact_number: z.object({
                number: z
                    .string({ required_error: "Learner's Contact Number is required" })
                    .refine((num) => num.length >= 7 && num.length <= 15, {
                        message: "Contact number must be between 7 and 15 digits",
                    }),
                country_code: z.string({ required_error: "Learner's Country Code is required" }),
            }),
        }),
    }),

    // Parent info - Required section
    parent_info: z.object({
        parent_first_name: z.string({ required_error: "Parent's First Name is required" }),
        parent_last_name: z.string({ required_error: "Parent's Last Name is required" }),
        parent_email: z
            .string({ required_error: "Parent's Email is required" })
            .email("Invalid email address"),
        parent_contact_number: z.object({
            number: z
                .string({ required_error: "Parent's Contact Number is required" })
                .refine((num) => num.length >= 7 && num.length <= 15, {
                    message: "Contact number must be between 7 and 15 digits",
                }),
            country_code: z.string({ required_error: "Parent's Country Code is required" }),
        }),
        parent_address: z.string({ required_error: "Parent's Address is required" }),
        emergency_contact_number: z.object({
            number: z
                .string({ required_error: "Emergency Contact Number is required" })
                .refine((num) => num.length >= 7 && num.length <= 15, {
                    message: "Emergency contact number must be between 7 and 15 digits",
                }),
            country_code: z.string({
                required_error: "Emergency Contact Country Code is required",
            }),
        }),
        relationship_to_learner: z.string({
            required_error: "Relationship to Learner is required",
        }),
    }),

    // Learner special needs - Required
    learner_special_needs: z.object({
        type_of_developmental_disability: z.string({
            required_error: "Developmental Disability is required",
        }),
        level_of_support_needed: z.string({
            required_error: "Level of Support Needed is required",
        }),
        assistive_device_used: z.string({ required_error: "Assistive Device Used is required" }),
        communication_style: z.string({ required_error: "Communication Style is required" }),
        description: z.string({ required_error: "Description of Needs is required" }),
        areas_of_support_needed: z.array(z.string(), {
            required_error: "Areas of Support Needed are required",
        }),
        learning_styles: z.array(z.string(), { required_error: "Learning Styles are required" }),
    }),

    // Education - Required
    education: z.object({
        current_school: z.string({ required_error: "Current School is required" }),
        iep_plan_key: z.string({ required_error: "IEP Plan Key is required" }),
        academic_strengths: z.array(z.string(), {
            required_error: "Academic Strengths are required",
        }),
        academic_challenges: z.array(z.string(), {
            required_error: "Academic Challenges are required",
        }),
    }),

    // Social skills - Required
    social_skills: z.object({
        communication_preferences: z.array(z.string(), {
            required_error: "Communication Preferences are required",
        }),
        social_interaction_styles: z.array(z.string(), {
            required_error: "Social Interaction Styles are required",
        }),
        behavioral_concerns: z.array(z.string(), {
            required_error: "Behavioral Concerns are required",
        }),
        techniques_to_calm: z.array(z.string(), {
            required_error: "Techniques to Calm are required",
        }),
    }),

    // Current interests - Required
    current_interests: z.object({
        interests: z.array(z.string(), { required_error: "Interests are required" }),
        extra_curricular_activities: z.array(z.string(), {
            required_error: "Extra-curricular Activities are required",
        }),
        favorite_activities: z.array(z.string(), {
            required_error: "Favorite Activities are required",
        }),
    }),

    // Learner goals - Required
    learner_goals: z.object({
        expected_goals: z.array(z.string(), { required_error: "Expected Goals are required" }),
        subjects_to_focus_on: z.array(z.string(), {
            required_error: "Subjects to Focus On are required",
        }),
        preferred_volunteer_qualities: z.array(z.string(), {
            required_error: "Preferred Volunteer Qualities are required",
        }),
        skill_level: z.string({ required_error: "Skill Level is required" }),
    }),

    // Additional info - Required
    additional_info: z.object({
        cultural_consideration: z.string({ required_error: "Cultural Consideration is required" }),
        other_concerns_or_requests: z.string({
            required_error: "Other Concerns or Requests are required",
        }),
        what_motivates_to_learn: z.string({
            required_error: "What Motivates the Learner is required",
        }),
    }),

    // Consent and permissions - Required
    consent_and_permissions: z.object({
        photo_or_video_consent: z.boolean({ required_error: "Photo or Video Consent is required" }),
        acknowledgement_of_program_policies: z.boolean({
            required_error: "Acknowledgement of Program Policies is required",
        }),
    }),
    profile_picture: z.object({
        image_url: z.string({ required_error: "Profile picture URL is required" }),
        image_id: z.string({ required_error: "Profile picture ID is required" }),
    }),
});

export type LearnerFormData = z.infer<typeof learnerFormSchema>;

// export const defaultVolunteerData: Volunteer = {
//     volunteer_description: "",
//     volunteer_education: "B.Tech",
//     volunteer_first_name: "Robert",
//     volunteer_last_name: "JR",
//     volunteer_birth_date: "12-01-2024",
//     volunteer_parent_email: "rithirithi246863@gmail.com",
//     volunteer_gender: "Male",
//     volunteer_higher_education: "Bachelor's Degree",
//     volunteer_languages: [],
//     education_details: "",
//     volunteer_experience: " Have good experience in  music for the past 2 years",
//     consented_from_parent: true,
//     volunteer_skills: [{ skill_id: "1", skill_name: "Music" }],
//     volunteer_contact_details: {
//         email: "",
//         contact_number: {
//             number: "",
//             country_code: "",
//         },
//         zip_code: "",
//     },
//     legal_and_safety_info: {
//         criminal_background_check_details: {
//             convicted_of_a_felony: false,
//             involved_in_criminal_activity: false,
//             convicted_of_a_crime: false,
//             description: "",
//         },
//         sex_offender_check_details: {
//             checked_for_sex_offender: false,
//             description: "",
//         },
//         disciplinary_check_details: {
//             terminated_from_volunteer_position: false,
//             involved_in_disputes: false,
//             dismissed_from_institution: false,
//             description: "",
//         },
//         health_and_safety_check_details: {
//             having_health_issues: false,
//             description: "",
//         },
//         other_consents_details: {
//             consent_to_background_checks: false,
//             agree_to_follow_organization_policies: false,
//             agree_to_understand_termination_of_volunteer_agreement: false,
//             description: "",
//         },
//         volunteer_experience_details: {
//             previously_volunteered: false,
//             invloved_in_complaints: false,
//             description: "",
//         },
//     },
//     profile_picture: {
//         image_url: "",
//         image_id: "",
//     },
//     profile_video: {
//         video_url: "",
//         video_id: "",
//     },
//     profile_document: {
//         document_url: "",
//         document_id: "",
//     },
//     volunteer_subjects: [],
//     consent_and_permissions: {
//         photo_or_video_consent: true,
//         acknowledgement_of_program_policies: true,
//     },
// };

export const defaultVolunteerData: Volunteer = {
    volunteer_first_name: "Walter",
    volunteer_last_name: "White",
    volunteer_birth_date: "1970-03-15",
    volunteer_parent_email: "walterwhite@gmail.com",
    volunteer_gender: "male",
    volunteer_higher_education: "masters",
    volunteer_education: "MSc Chemistry",
    volunteer_experience: "20 years",
    volunteer_description: "I'm a Chemist.",
    volunteer_languages: [
        {
            language_name: "Tamil",
            language_id: "a695792f-0ecd-4fff-bb46-f0feaf782c2b",
        },
        {
            language_name: "English (United States)",
            language_id: "a191a4a2-7007-42c6-a8ec-adea8a1fa8ac"
        },
    ],
    consented_from_parent: true,
    volunteer_skills: [
        {
            skill_name: "Basic rhythm",
            skill_id: "3eb6efaf-fa76-4765-99c5-e160a303aa34",
        },
    ],
    volunteer_contact_details: {
        email: "",
        contact_number: {
            number: "9876543210",
            country_code: "+91",
        },
        zip_code: "638451",
    },
    legal_and_safety_info: {
        criminal_background_check_details: {
            convicted_of_a_felony: false,
            involved_in_criminal_activity: false,
            convicted_of_a_crime: false,
            description: "",
        },
        sex_offender_check_details: {
            checked_for_sex_offender: false,
            description: "",
        },
        disciplinary_check_details: {
            terminated_from_volunteer_position: false,
            involved_in_disputes: false,
            dismissed_from_institution: false,
            description: "",
        },
        health_and_safety_check_details: {
            having_health_issues: false,
            description: "",
        },
        other_consents_details: {
            consent_to_background_checks: false,
            agree_to_follow_organization_policies: false,
            agree_to_understand_termination_of_volunteer_agreement: false,
            description: "",
        },
        volunteer_experience_details: {
            previously_volunteered: false,
            invloved_in_complaints: false,
            description: "",
        },
    },
    profile_picture: {
        image_url: "image_url",
        image_id: "image_id",
    },
    profile_video: {
        video_url: "video_url",
        video_id: "video_id",
    },
    profile_document: {
        document_url: "document_url",
        document_id: "document_id",
    },
    volunteer_subjects: [
        {
            subject_name: "Chemistry",
            subject_id: "5b363d32-1aa9-45ba-86ce-598db4739330",
        },
        {
            subject_name: "Physics",
            subject_id: "4a4cbf72-edd0-4099-aa7f-2e45ea81889d"
        },
    ],
    consent_and_permissions: {
        photo_or_video_consent: true,
        acknowledgement_of_program_policies: true,
    },
};

export const defaultLearnerData: Learner = {
    learner_personal_info: {
        learner_first_name: "Walter",
        learner_last_name: "Jr",
        learner_date_of_birth: "2010-12-12",
        learner_gender: "male",
        learner_preferred_pronoun: "he/him",
        learner_primary_language: "English",
        learner_contact_details: {
            email: "walterjr@gmail.com",
            contact_number: {
                number: "9876543210",
                country_code: "+91",
            },
            zip_code: "638451",
        },
    },
    parent_info: {
        parent_first_name: "Walter",
        parent_last_name: "White",
        parent_email: "wlaterwhite@gmail.com",
        relationship_to_learner: "father",
        parent_contact_number: {
            number: "9876543210",
            country_code: "+91",
        },
        emergency_contact_number: {
            number: "9384913517",
            country_code: "+91",
        },
        parent_address: "Address",
    },

    learner_special_needs: {
        type_of_developmental_disability: "Physical Disability",
        level_of_support_needed: "moderate",
        assistive_device_used: "Wheelchairs",
        communication_style: "Verbal",
        description: "Description",
        areas_of_support_needed: ["Social skills", "Motor skills"],
        learning_styles: ["Visual", "Verbal"],
    },

    education: {
        current_school: "current_school",
        iep_plan_key: "iep_plan_key",
        academic_strengths: ["math"],
        academic_challenges: ["difficulty_with_reading"],
    },

    social_skills: {
        communication_preferences: ["visual"],
        social_interaction_styles: ["engaging"],
        behavioral_concerns: ["difficulty_in_social_interaction"],
        techniques_to_calm: ["provide_a_quiet_space"],
    },

    current_interests: {
        interests: ["Basic chords"],
        extra_curricular_activities: ["Sports"],
        favorite_activities: ["Drawing and coloring"],
    },

    learner_goals: {
        expected_goals: ["Encourage Independence"],
        subjects_to_focus_on: ["Basic chords"],
        preferred_volunteer_qualities: ["patience"],
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
    }
};
