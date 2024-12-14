import { z } from "zod";

export const volunteerFormSchema = z.object({
    volunteer_education: z.string().optional(),
    volunteer_first_name: z.string().optional(),
    volunteer_last_name: z.string().optional(),
    volunteer_birth_date: z.any().optional(),
    volunteer_description: z.string().optional(),
    volunteer_parent_email: z.string().email("Invalid email").optional(),
    volunteer_gender: z.string().optional(),
    volunteer_higher_education: z.string().optional(),
    volunteer_languages: z.array(z.any()).optional(),
    education_details: z.string().optional(),
    volunteer_experience: z.string().optional(),
    consented_from_parent: z.boolean().optional(),
    volunteer_skills: z
        .array(
            z.object({
                skill_name: z.string().optional(),
                skill_id: z.string().optional(),
            })
        )
        .optional(),

    // Contact Details validations
    volunteer_contact_details: z
        .object({
            email: z.string().email("Invalid email").optional(),
            contact_number: z
                .object({
                    number: z.string().optional(),
                    country_code: z.string().optional(),
                })
                .optional(),
            zip_code: z.string().optional(),
        })
        .optional(),

    // Legal and Safety Info validations
    legal_and_safety_info: z
        .object({
            //1.Criminal Background Check Details
            criminal_background_check_details: z
                .object({
                    convicted_of_a_felony: z.boolean().optional(),
                    involved_in_criminal_activity: z.boolean().optional(),
                    convicted_of_a_crime: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),

            //2. Sex Offender Check Details
            sex_offender_check_details: z
                .object({
                    checked_for_sex_offender: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),

            //3. Disciplinary Check Details
            disciplinary_check_details: z
                .object({
                    terminated_from_volunteer_position: z.boolean().optional(),
                    involved_in_disputes: z.boolean().optional(),
                    dismissed_from_institution: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),

            //4. Health and Safety Check Details
            health_and_safety_check_details: z
                .object({
                    having_health_issues: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),

            //5. Other Consents Details
            other_consents_details: z
                .object({
                    consent_to_background_checks: z.boolean().optional(),
                    agree_to_follow_organization_policies: z.boolean().optional(),
                    agree_to_understand_termination_of_volunteer_agreement: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),

            //6. Volunteer Experience Details
            volunteer_experience_details: z
                .object({
                    previously_volunteered: z.boolean().optional(),
                    invloved_in_complaints: z.boolean().optional(),
                    description: z.string().optional(),
                })
                .optional(),
        })
        .optional(),

    //Consent and Permissions
    consent_and_permissions: z
        .object({
            photo_or_video_consent: z.boolean().optional(),
            acknowledgement_of_program_policies: z.boolean().optional(),
        })
        .optional(),

    //Profile Picture
    profile_picture: z
        .object({
            image_url: z.string().optional(),
            image_id: z.string().optional(),
        })
        .optional(),

    //Profile Video
    profile_video: z
        .object({
            video_url: z.string().optional(),
            video_id: z.string().optional(),
        })
        .optional(),

    //Profile Document
    profile_document: z
        .object({
            document_url: z.string().optional(),
            document_id: z.string().optional(),
        })
        .optional(),

    //Volunteer Subjects
    volunteer_subjects: z.array(z.any()).optional(),
});

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

export const learnerFormSchema = z.object({
    //Learner personal info
    learner_personal_info: z
        .object({
            learner_first_name: z.string().optional(),
            learner_last_name: z.string().optional(),
            learner_date_of_birth: z.string().optional(),
            learner_gender: z.string().optional(),
            learner_preferred_pronoun: z.string().optional(),
            learner_primary_language: z.string().optional(),
            learner_contact_details: z
                .object({
                    email: z.string().email("Invalid email").optional(),
                    contact_number: z
                        .object({
                            number: z.string().optional(),
                            country_code: z.string().optional(),
                        })
                        .optional(),
                    zip_code: z.string().optional(),
                })
                .optional(),
        })
        .optional(),

    //Learner special needs
    learner_special_needs: z
        .object({
            type_of_developmental_disability: z.string().optional(),
            level_of_support_needed: z.string().optional(),
            assistive_device_used: z.string().optional(),
            communication_style: z.string().optional(),
            description: z.string().optional(),
            areas_of_support_needed: z.array(z.any()).optional(),
            learning_styles: z.array(z.any()).optional(),
        })
        .optional(),

    //Parent info
    parent_info: z
        .object({
            parent_first_name: z.string().optional(),
            parent_last_name: z.string().optional(),
            parent_email: z.string().email("Invalid email").optional(),
            parent_contact_number: z
                .object({
                    number: z.string().optional(),
                    country_code: z.string().optional(),
                })
                .optional(),
            parent_address: z.string().optional(),
            emergency_contact_number: z
                .object({
                    number: z.string().optional(),
                    country_code: z.string().optional(),
                })
                .optional(),
            relationship_to_learner: z.string().optional(),
        })
        .optional(),

    //Education
    education: z
        .object({
            current_school: z.string().optional(),
            iep_plan_key: z.string().optional(),
            academic_strengths: z.array(z.any()).optional(),
            academic_challenges: z.array(z.any()).optional(),
        })
        .optional(),

    //Social skills
    social_skills: z
        .object({
            communication_preferences: z.array(z.any()).optional(),
            social_interaction_styles: z.array(z.any()).optional(),
            behavioral_concerns: z.array(z.any()).optional(),
            techniques_to_calm: z.array(z.any()).optional(),
        })
        .optional(),

    //Current interests
    current_interests: z
        .object({
            interests: z.array(z.any()).optional(),
            extra_curricular_activities: z.array(z.any()).optional(),
            favorite_activities: z.array(z.any()).optional(),
        })
        .optional(),

    //Learner goals
    learner_goals: z
        .object({
            expected_goals: z.array(z.string()).optional(),
            subjects_to_focus_on: z.array(z.string()).optional(),
            preferred_volunteer_qualities: z.array(z.string()).optional(),
            skill_level: z.string().optional(),
        })
        .optional(),

    //Additional info
    additional_info: z
        .object({
            cultural_consideration: z.string().optional(),
            other_concerns_or_requests: z.string().optional(),
            what_motivates_to_learn: z.string().optional(),
        })
        .optional(),

    //Consent and permissions
    consent_and_permissions: z
        .object({
            photo_or_video_consent: z.boolean().optional(),
            acknowledgement_of_program_policies: z.boolean().optional(),
        })
        .optional(),
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
    volunteer_description: "some description",
    volunteer_education: "some education",
    volunteer_first_name: "Iwin",
    volunteer_last_name: "T",
    volunteer_birth_date: "2024-12-25T18:30:00.000Z",
    volunteer_parent_email: "iwinissacofficial@gmail.com",
    volunteer_gender: "male",
    volunteer_higher_education: "bachelors",
    volunteer_languages: [
        {
            language_name: "Abkhazian",
            language_id: "734e54d6-8762-4604-bae6-64d0bde4e0c1",
        },
    ],
    education_details: "sqs",
    volunteer_experience: "dwdwd",
    consented_from_parent: true,
    volunteer_skills: [
        {
            skill_name: "bdcbe9a0-3c68-4374-b7d1-5203cb8cbf25",
            skill_id: "Guitar tuning",
        },
    ],
    volunteer_contact_details: {
        email: "iwinissacofficial@gmail.com",
        contact_number: {
            number: "9384913517",
            country_code: "+91",
        },
        zip_code: "638451",
    },
    legal_and_safety_info: {
        criminal_background_check_details: {
            convicted_of_a_felony: false,
            involved_in_criminal_activity: false,
            convicted_of_a_crime: false,
            description: "criminal_background_check_details",
        },
        sex_offender_check_details: {
            checked_for_sex_offender: false,
            description: "sex_offender_check_details",
        },
        disciplinary_check_details: {
            terminated_from_volunteer_position: false,
            involved_in_disputes: false,
            dismissed_from_institution: false,
            description: "disciplinary_check_details",
        },
        health_and_safety_check_details: {
            having_health_issues: false,
            description: "health_and_safety_check_details",
        },
        other_consents_details: {
            consent_to_background_checks: false,
            agree_to_follow_organization_policies: false,
            agree_to_understand_termination_of_volunteer_agreement: false,
            description: "other_consents_details",
        },
        volunteer_experience_details: {
            previously_volunteered: false,
            invloved_in_complaints: false,
            description: "volunteer_experience_details",
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
            subject_name: "Mathematics",
            subject_id: "44b87f07-d623-47e2-b8c7-a895aa5369eb",
        },
    ],
    consent_and_permissions: {
        photo_or_video_consent: true,
        acknowledgement_of_program_policies: true,
    },
};

export const defaultLearnerData: Learner = {
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
            zip_code: "638451",
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
