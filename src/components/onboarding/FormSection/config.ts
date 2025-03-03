import { z, ZodError, ZodIssue } from "zod";
import moment from "moment";
import { ADULT_VOLUNTEER_AGE } from "@/constants/volunteer";

const contactNumberValidation = z
    .object({
        number: z
            .string({ required_error: "Phone Number is required" })
            .refine((num) => num.length >= 7 && num.length <= 15, {
                message: "Phone number must be between 7 and 15 digits",
            }),
        country_code: z
            .string({ required_error: "Country Code is required" }),
    })
    .or(z.undefined())
    .refine((value) => value?.country_code, {
        message: "Country Code is required",
    })
    .refine((value) => value?.number, {
        message: "Phone Number is required",
    })
    .refine((value) => value !== undefined && value?.number?.length >= 7 && value?.number?.length <= 15, {
        message: "Phone number must be between 7 and 15 digits",
    });


// Volunteer Schema & Default Data

export const volunteerFormSchema = z.object({
    volunteer_first_name: z
        .string({ required_error: "First Name is required" })
        .min(1, { message: "First Name cannot be empty" }),
    volunteer_last_name: z
        .string({ required_error: "Last Name is required" })
        .min(1, { message: "Last Name cannot be empty" }),
    volunteer_birth_date: z.string({ required_error: "Please select your birthday" }),
    consented_from_parent: z.boolean().optional(),
    volunteer_parent_name: z.string().optional(),
    volunteer_parent_email: z.string().optional(),
    volunteer_gender: z.string({ required_error: "Please select your gender" }),
    volunteer_education: z
        .string({ required_error: "Please provide your education details" })
        .min(1, { message: "Education details cannot be empty" }),
    volunteer_higher_education: z.string({
        required_error: "Higher education details are required",
    }),
    volunteer_languages: z
        .array(z.any(), { required_error: "Please specify the languages you know" })
        .nonempty("Please add at least one language"),
    volunteer_experience: z
        .string({ required_error: "Experience details are required" })
        .min(1, { message: "Experience details cannot be empty" }),
    volunteer_skills: z
        .array(
            z.object({
                skill_name: z.string({ required_error: "Skill name is required" }),
                skill_id: z.string({ required_error: "Skill ID is required" }),
            }),
            { required_error: "Please add at least one skill" }
        )
        .nonempty("Please add at least one skill"),
    volunteer_description: z
        .string({ required_error: "Description is required" })
        .min(1, { message: "Description cannot be empty" }),

    // Contact Details validations
    volunteer_contact_details: z.object({
        email: z
            .string({ required_error: "Email is required" })
            .email("Please enter a valid email address"),
        contact_number: contactNumberValidation,
        zip_code: z
            .string({ required_error: "Zip code is required" })
            .min(1, { message: "Zip code cannot be empty" }),
        country: z
            .string({ required_error: "Country is required" })
            .min(1, { message: "Country cannot be empty" }),
        timezone: z
            .string({ required_error: "Time Zone is required" })
            .min(1, { message: "Time Zone cannot be empty" }),
    }),

    // Legal and Safety Info validations
    legal_and_safety_info: z.object({
        criminal_background_check_details: z
            .object({
                convicted_of_a_felony: z.boolean({
                    required_error: "Please specify if you were convicted of a felony",
                }),
                involved_in_criminal_activity: z.boolean({
                    required_error: "Please specify if you were involved in criminal activity",
                }),
                convicted_of_a_crime: z.boolean({
                    required_error: "Please specify if you were convicted of a crime",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const {
                        convicted_of_a_crime,
                        involved_in_criminal_activity,
                        convicted_of_a_felony,
                        description,
                    } = fields;
                    return (
                        !(
                            convicted_of_a_crime ||
                            involved_in_criminal_activity ||
                            convicted_of_a_felony
                        ) ||
                        (description && description.trim().length > 0)
                    );
                },
                {
                    message:
                        'Description is required if any criminal conviction or activity is marked as "yes".',
                    path: ["description"],
                }
            ),
        sex_offender_check_details: z
            .object({
                checked_for_sex_offender: z.boolean({
                    required_error: "Please specify if you are on any sex offender registry.",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const { checked_for_sex_offender, description } = fields;
                    return (
                        !checked_for_sex_offender || (description && description.trim().length > 0)
                    );
                },
                {
                    message: 'Description is required if sex offender registry is marked as "yes".',
                    path: ["description"],
                }
            ),
        disciplinary_check_details: z
            .object({
                terminated_from_volunteer_position: z.boolean({
                    required_error: "Please specify if you were terminated from a position",
                }),
                involved_in_disputes: z.boolean({
                    required_error: "Please specify if you were involved in disputes",
                }),
                dismissed_from_institution: z.boolean({
                    required_error: "Please specify if you were dismissed from an institution",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const {
                        terminated_from_volunteer_position,
                        involved_in_disputes,
                        dismissed_from_institution,
                        description,
                    } = fields;
                    return (
                        !(
                            terminated_from_volunteer_position ||
                            involved_in_disputes ||
                            dismissed_from_institution
                        ) ||
                        (description && description.trim().length > 0)
                    );
                },
                {
                    message:
                        'Description is required if terminated, involved in disputes, or dismissed is marked as "yes".',
                    path: ["description"],
                }
            ),
        health_and_safety_check_details: z
            .object({
                having_health_issues: z.boolean({
                    required_error: "Please specify if you have health issues",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const { having_health_issues, description } = fields;
                    return !having_health_issues || (description && description.trim().length > 0);
                },
                {
                    message: 'Description is required if having health issues is marked as "yes".',
                    path: ["description"],
                }
            ),
        other_consents_details: z
            .object({
                consent_to_background_checks: z.boolean({
                    required_error: "Please confirm your consent to background checks",
                }),
                agree_to_follow_organization_policies: z.boolean({
                    required_error: "Please confirm that you agree to follow policies",
                }),
                agree_to_understand_termination_of_volunteer_agreement: z.boolean({
                    required_error: "Please confirm that you understand the agreement",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const {
                        consent_to_background_checks,
                        agree_to_follow_organization_policies,
                        agree_to_understand_termination_of_volunteer_agreement,
                        description,
                    } = fields;
                    return (
                        (
                            consent_to_background_checks &&
                            agree_to_follow_organization_policies &&
                            agree_to_understand_termination_of_volunteer_agreement
                        ) ||
                        (description && description.trim().length > 0)
                    );
                },
                {
                    message: 'Description is required if any consent agreement is marked as "no".',
                    path: ["description"],
                }
            ),
        volunteer_experience_details: z
            .object({
                invloved_in_complaints: z.boolean({
                    required_error: "Please specify if you were involved in complaints",
                }),
                description: z.string().optional(),
            })
            .refine(
                (fields) => {
                    const { invloved_in_complaints, description } = fields;
                    return (
                        !(invloved_in_complaints) ||
                        (description && description.trim().length > 0)
                    );
                },
                {
                    message:
                        'Description is required if involved in complaints is marked as "yes".',
                    path: ["description"],
                }
            ),
    }),

    // Consent and Permissions
    consent_and_permissions: z.object({
        photo_or_video_consent: z.boolean({ required_error: "Photo or video consent is required" }),
        acknowledgement_of_program_policies: z.boolean({
            required_error: "Acknowledgement of policies is required",
        }),
    }),

    // Profile Picture
    profile_picture: z
        .object({
            image_url: z.string({ required_error: "Profile picture URL is required" }).min(1, {
                message: "Profile picture cannot be empty",
            }),
            image_id: z.string({ required_error: "Profile picture ID is required" }).min(1, {
                message: "Profile picture cannot be empty",
            }),
        })
        .required(),

    // Profile Video
    profile_video: z
        .object({
            video_url: z.string({ required_error: "Profile video URL is required" }).min(1, {
                message: "Profile video cannot be empty",
            }),
            video_id: z.string({ required_error: "Profile video ID is required" }).min(1, {
                message: "Profile video cannot be empty",
            }),
        })
        .optional(),

    // Profile Document
    // profile_document: z
    //     .object({
    //         document_url: z.string({ required_error: "Document URL is required" }).min(1, {
    //             message: "Document cannot be empty",
    //         }),
    //         document_id: z.string({ required_error: "Document ID is required" }).min(1, {
    //             message: "Document cannot be empty",
    //         }),
    //     })
    //     .required(),

    // Volunteer Subjects
    // volunteer_subjects: z
    //     .array(z.any(), { required_error: "Please add at least one subject" })
    //     .nonempty("Please add at least one subject"),
    
    terms_and_conditions_accepted: z.boolean({ required_error: "Acceptance of terms and conditions is required" }),
}).superRefine((data) => {
    if (!data?.terms_and_conditions_accepted) {
        throw new ZodError([{ message: "Acceptance of terms and conditions is required", path: ["terms_and_conditions_accepted"], code: "invalid_type", expected: "boolean", received: "undefined" }])
    }
    return true;
});

export function validateVolunteerParentDetails(data: any) {
    const errors: { [key: string]: string } = {};
    let isSuccess = true;

    const age = moment().diff(moment(data.volunteer_birth_date, "DD-MM-YYYY"), 'years');

    if (age < ADULT_VOLUNTEER_AGE) {
        const requiredFields = {
            consented_from_parent: `Parent consent is required for volunteers under ${ADULT_VOLUNTEER_AGE}`,
            volunteer_parent_name: `Parent name is required for volunteers under ${ADULT_VOLUNTEER_AGE}`,
            volunteer_parent_email: `Parent email is required for volunteers under ${ADULT_VOLUNTEER_AGE}`,
        };

        Object.entries(requiredFields).forEach(([key, errorMessage]) => {
            const value = data[key];
            if (!value || (typeof value === "string" && value.trim().length === 0)) {
                isSuccess = false;
                errors[key] = errorMessage;
            }
        });
    }

    return { success: isSuccess, errors };
}

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;
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
            language_id: "a191a4a2-7007-42c6-a8ec-adea8a1fa8ac",
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
        // email: "",
        contact_number: {
            number: "9876543210",
            country_code: "+91",
        },
        zip_code: "638451",
        country: "india",
        timezone: "asia/kolkata"
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
    volunteer_subjects: [
        {
            subject_name: "Chemistry",
            subject_id: "5b363d32-1aa9-45ba-86ce-598db4739330",
        },
        {
            subject_name: "Physics",
            subject_id: "4a4cbf72-edd0-4099-aa7f-2e45ea81889d",
        },
    ],
    consent_and_permissions: {
        photo_or_video_consent: true,
        acknowledgement_of_program_policies: true,
    },
};

// Learner Schema & Default Data

type learnerParentSchemaType = {
    parent_first_name: string,
    parent_last_name: string,
    parent_email: string,
    parent_contact_number: number | string | any,
    parent_address: string,
    relationship_to_learner: string
}

const learnerParentSchema = z.object({
    parent_first_name: z.string({ required_error: "Parent's First Name is required" }),
    parent_last_name: z.string({ required_error: "Parent's Last Name is required" }),
    parent_email: z.string({ required_error: "Parent's Email is required" }),
    parent_contact_number: z.any().optional(),
    parent_address: z.string({ required_error: "Parent's Address is required" }),
    relationship_to_learner: z.string({
        required_error: "Relationship to Learner is required",
    }),
})

export const learnerFormSchema = z.object({
    // Learner personal info - Required section
    learner_personal_info: z.object({
        learner_first_name: z.string({ required_error: "Learner's First Name is required" }).min(1, { message: "Learner's First Name cannot be empty" }),
        learner_last_name: z.string({ required_error: "Learner's Last Name is required" }).min(1, { message: "Learner's Last Name cannot be empty" }),
        learner_date_of_birth: z.string({ required_error: "Learner's Date of Birth is required" }),
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
            contact_number: contactNumberValidation,
            zip_code: z
                .string({ required_error: "Zip code is required" })
                .min(1, { message: "Zip code cannot be empty" }),
            country: z
                .string({ required_error: "Country is required" })
                .min(1, { message: "Country cannot be empty" }),
            timezone: z
                .string({ required_error: "Time Zone is required" })
                .min(1, { message: "Time Zone cannot be empty" }),
        }),
    }),

    // Parent info - Required section
    parent_info: learnerParentSchema.partial(),

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
        description: z.string({ required_error: "Description of Needs is required" }).min(1, { message: "Description of Needs is required" }),
        areas_of_support_needed: z.array(z.string(), {
            required_error: "Areas of Support Needed are required",
        }).nonempty("Areas of Support Needed are required"),
    }),

    // Education - Required
    education: z.object({
        current_school: z.string({ required_error: "Current School is required" }).min(1, { message: "Current School is required" }),
        iep_plan_key: z.string({ required_error: "IEP Plan Key is required" }).min(1, { message: "IEP Plan Key of Needs is required" }),
        academic_strengths: z.array(z.string(), {
            required_error: "Academic Strengths are required",
        }).nonempty("Academic Strengths are required"),
        academic_challenges: z.array(z.string(), {
            required_error: "Academic Challenges are required",
        }).nonempty("Academic Challenges are required"),
    }),

    // Social skills - Required
    social_skills: z.object({
        social_interaction_styles: z.array(z.string(), {
            required_error: "Social Interaction Styles are required",
        }).nonempty("Social Interaction Styles are required"),
        behavioral_concerns: z.array(z.string(), {
            required_error: "Behavioral Concerns are required",
        }).nonempty("Behavioral Concerns are required"),
        techniques_to_calm: z.array(z.string(), {
            required_error: "Techniques to Calm are required",
        }).nonempty("Techniques to Calm are required"),
    }),

    // Current interests - Required
    current_interests: z.object({
        extra_curricular_activities: z.string({
            required_error: "Extra-curricular Activities are required",
        }).min(1, { message: "Extra-curricular Activities  are required" }),
        favorite_activities: z.string({
            required_error: "Favorite Activities are required",
        }).min(1, { message: "Favorite Activities  are required" }),
    }),

    // Learner goals - Required
    learner_goals: z.object({
        expected_goals: z.array(z.string(), { required_error: "Expected Goals are required" }).nonempty("Expected Goals are required"),
        subjects_to_focus_on: z.array(z.string(), {
            required_error: "Subjects to Focus On are required",
        }).nonempty("Subjects to Focus On are required"),
        preferred_volunteer_qualities: z.string({ required_error: "Preferred Volunteer Qualities are required" })
            .min(1, { message: "Preferred Volunteer Qualities are required" }),
        skill_level: z.string({ required_error: "Skill Level is required" }),
    }),

    // Additional info - Required
    additional_info: z.object({
        cultural_consideration: z.string({ required_error: "Cultural Consideration is required" }).min(1, { message: "Cultural Consideration is required" }),
        other_concerns_or_requests: z.string({
            required_error: "Other Concerns or Requests are required",
        }).min(1, { message: "Other Concerns or Requests are required" }),
        what_motivates_to_learn: z.string({
            required_error: "What Motivates the Learner is required",
        }).min(1, { message: "What Motivates the Learner is required" }),
    }),

    // Consent and permissions - Required
    consent_and_permissions: z.object({
        photo_or_video_consent: z.boolean({ required_error: "Photo or Video Consent is required" }),
        acknowledgement_of_program_policies: z.boolean({
            required_error: "Acknowledgement of Program Policies is required",
        }),
    }),
    profile_picture: z
        .object({
            image_url: z.string({ required_error: "Profile picture URL is required" }).min(1, {
                message: "Profile picture cannot be empty",
            }),
            image_id: z.string({ required_error: "Profile picture ID is required" }).min(1, {
                message: "Profile picture cannot be empty",
            }),
        })
        .required(),
    terms_and_conditions_accepted: z.boolean({ required_error: "Acceptance of terms and conditions is required" }),
}).superRefine((data) => {
    if (!data?.terms_and_conditions_accepted) {
        throw new ZodError([{ message: "Acceptance of terms and conditions is required", path: ["terms_and_conditions_accepted"], code: "invalid_type", expected: "boolean", received: "undefined" }])
    }
    return true;
});

const emailSchema = z.string().email("Invalid email address").optional(); 
export function validateLearnerParentFields(data: any) {
    const errors: { [key: string]: string } = {};
    let isSuccess = true;

    const learnerDob = data?.learner_personal_info?.learner_date_of_birth;
    const age = learnerDob ? moment().diff(moment(learnerDob, "DD-MM-YYYY"), 'years') : null;

    if (age !== null && age < 18) {
        (Object.keys(data?.parent_info || {}) as (keyof learnerParentSchemaType)[]).forEach((key) => {
            const field = data?.parent_info?.[key];
            if (!field || (typeof field === "string" && field.trim().length === 0)) {
                errors[`parent_info.${key}`] = `${key.split("_").join(" ")} is required for learners under 18`;
                isSuccess = false;
            }
            if (key === "parent_email") {
                try {
                    emailSchema.parse(field);
                } catch (e) {
                    errors[`parent_info.${key}`] = "Invalid email address";
                    isSuccess = false;
                }
            }
            if (key === "parent_contact_number") {
                try {
                    contactNumberValidation.parse(field);
                } catch (e) {
                    errors[`parent_info.${key}`] = "Parent Contact Number is required for learners under 18";
                    isSuccess = false;
                }
            }
        });
    }

    return { success: isSuccess, errors: isSuccess ? {} : errors };
}

export type LearnerFormData = z.infer<typeof learnerFormSchema>;

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
            country: "india",
            timezone: "asia/kolkata"
        },
    },
    // parent_info: {
    //     parent_first_name: "Walter",
    //     parent_last_name: "White",
    //     parent_email: "wlaterwhite@gmail.com",
    //     relationship_to_learner: "father",
    //     parent_contact_number: {
    //         number: "9876543210",
    //         country_code: "+91",
    //     },
    //     parent_address: "Address",
    // },

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
        extra_curricular_activities: "Sports",
        favorite_activities: "Drawing and coloring",
    },

    learner_goals: {
        expected_goals: ["Encourage Independence"],
        subjects_to_focus_on: ["science"],
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
    },
    // profile_picture: null,
};
