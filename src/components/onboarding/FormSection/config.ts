import { z } from "zod";

export const volunteerFormSchema = z.object({
    volunteer_education: z.string().optional(),
    volunteer_first_name: z.string().min(1, "First name is required").optional(),
    volunteer_last_name: z.string().min(1, "Last name is required").optional(),
    volunteer_birth_date: z.any().optional(),
    volunteer_description: z.string().min(1, "Description is required").optional(),
    volunteer_parent_email: z.string().email("Invalid email").optional(),
    volunteer_gender: z.string().min(1, "Gender is required").optional(),
    volunteer_higher_education: z.string().min(1, "Education is required").optional(),
    volunteer_languages: z.array(z.any()).optional(),
    education_details: z.string().min(1, "Education details is required").optional(),
    volunteer_experience: z.string().min(1, "Experience is required").optional(),
    consented_from_parent: z.boolean().optional().default(false),
    volunteer_skills: z
        .array(
            z.object({
                skill_name: z.string().min(1, "Skill is required"),
                skill_id: z.string().min(1, "Skill ID is required"),
            })
        )
        .optional(),
    // Contact Details validations
    volunteer_contact_details: z
        .object({
            email: z.string().email("Invalid email").default("").optional(),
            contact_number: z.object({
                number: z.string().min(1, "Contact number is required").optional(),
                country_code: z.string().min(1, "Country code is required").optional(),
            }),
            zip_code: z.string().min(1, "Zip code is required").optional(),
        })
        .optional(),

    // Legal and Safety Info validations
    legal_and_safety_info: z
        .object({
            //1.Criminal Background Check Details
            criminal_background_check_details: z.object({
                convicted_of_a_felony: z.boolean().optional().default(false),
                involved_in_criminal_activity: z.boolean().optional().default(false),
                convicted_of_a_crime: z.boolean().optional().default(false),
                description: z.string().optional().default(""),
            }),

            //2. Sex Offender Check Details
            sex_offender_check_details: z.object({
                checked_for_sex_offender: z.boolean().optional().default(false),
                description: z.string().optional().default(""),
            }),

            //3. Disciplinary Check Details
            disciplinary_check_details: z.object({
                terminated_from_volunteer_position: z.boolean().optional().default(false),
                involved_in_disputes: z.boolean().optional().default(false),
                dismissed_from_institution: z.boolean().optional().default(false),
                description: z.string().optional().default(""),
            }),

            //4. Health and Safety Check Details
            health_and_safety_check_details: z.object({
                having_health_issues: z.boolean().optional().default(false),
                description: z.string().optional().default(""),
            }),

            //5. Other Consents Details
            other_consents_details: z.object({
                consent_to_background_checks: z.boolean().optional().default(false),
                agree_to_follow_organization_policies: z.boolean().optional().default(false),
                agree_to_understand_termination_of_volunteer_agreement: z
                    .boolean()
                    .optional()
                    .default(false),
                description: z.string().optional().default(""),
            }),

            //6. Volunteer Experience Details
            volunteer_experience_details: z.object({
                previously_volunteered: z.boolean().optional().default(false),
                invloved_in_complaints: z.boolean().optional().default(false),
                description: z.string().optional().default(""),
            }),
        })
        .optional(),

    //Consent and Permissions
    consent_and_permissions: z
        .object({
            photo_or_video_consent: z.boolean().optional().default(false),
            acknowledgement_of_program_policies: z.boolean().optional().default(false),
        })
        .optional(),

    //Profile Picture
    profile_picture: z
        .object({
            image_url: z.string().optional().default(""),
            image_id: z.string().optional().default(""),
        })
        .optional(),

    //Profile Video
    profile_video: z
        .object({
            video_url: z.string().optional().default(""),
            video_id: z.string().optional().default(""),
        })
        .optional(),

    //Profile Document
    profile_document: z
        .object({
            document_url: z.string().optional().default(""),
            document_id: z.string().optional().default(""),
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
            learner_first_name: z.string().min(1, "First name is required").optional(),
            learner_last_name: z.string().min(1, "Last name is required").optional(),
            learner_date_of_birth: z.string().optional(),
            learner_gender: z.string().min(1, "Gender is required").optional(),
            learner_preferred_pronoun: z
                .string()
                .min(1, "Preferred pronoun is required")
                .optional(),
            learner_primary_language: z.string().min(1, "Primary language is required").optional(),
            learner_contact_details: z.object({
                email: z.string().email("Invalid email").default("").optional(),
                contact_number: z.object({
                    number: z.string().min(1, "Contact number is required").optional(),
                    country_code: z.string().min(1, "Country code is required").optional(),
                }),
                zip_code: z.string().min(1, "Zip code is required").optional(),
            }),
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
            parent_first_name: z.string().min(1, "First name is required").optional(),
            parent_last_name: z.string().min(1, "Last name is required").optional(),
            parent_email: z.string().email("Invalid email").default("").optional(),
            parent_contact_number: z.object({
                number: z.string().min(1, "Contact number is required").optional(),
                country_code: z.string().min(1, "Country code is required").optional(),
            }),
            parent_address: z.string().optional(),
            emergency_contact_number: z.object({
                number: z.string().min(1, "Contact number is required").optional(),
                country_code: z.string().min(1, "Country code is required").optional(),
            }),
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
            photo_or_video_consent: z.boolean().optional().default(false),
            acknowledgement_of_program_policies: z.boolean().optional().default(false),
        })
        .optional(),
});

export type LearnerFormData = z.infer<typeof learnerFormSchema>;
