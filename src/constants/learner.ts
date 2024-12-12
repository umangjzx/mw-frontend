export const LearnerOnboardingConstants = {
    title: "Enroll a learner",
    description:
        "Thank you for your interest in joining Melody Wings. Fill out the form below and we'll get you a good fit.",
};

// Parent/Guardian Information Fields
const ParentGuardianFields: FormField[] = [
    {
        id: "parent_first_name",
        label: "First Name",
        inputType: "text",
        placeholder: "Enter First Name",
        gridCols: 1,
    },
    {
        id: "parent_last_name",
        label: "Last Name",
        inputType: "text",
        placeholder: "Enter Last Name",
        gridCols: 1,
    },
    {
        id: "relationship_to_learner",
        label: "Relationship to the Learner",
        inputType: "select",
        placeholder: "Select relationship",
        gridCols: 2,
        inputClassName: "!w-[49%]",
        className: "w-full",
    },
    {
        id: "parent_email",
        label: "Email address",
        inputType: "text",
        placeholder: "abc@example.com",
        gridCols: 1,
    },
    {
        id: "parent_contact_number",
        label: "Your contact number",
        sublabel: "(with country code)",
        inputType: "contact-input",
        placeholder: "Enter Email ID",
        sublabelAlignment: "right",
        gridCols: 1,
        disabled: false,
    },
    {
        id: "parent_address",
        label: "Address",
        inputType: "textarea",
        placeholder: "Type address here",
        gridCols: 2,
        inputClassName: "w-[49%]",
    },
    {
        id: "emergency_contact_number",
        label: "Emergency Contact Number",
        inputType: "contact-input",
        placeholder: "Enter Email ID",
        sublabelAlignment: "right",
        gridCols: 1,
        disabled: false,
    },
];

// Learner's Personal Information Fields
const LearnerPersonalFields: FormField[] = [
    {
        id: "learner_first_name",
        label: "First Name",
        inputType: "text",
        placeholder: "Enter First Name",
        gridCols: 1,
    },
    {
        id: "learner_last_name",
        label: "Last Name",
        inputType: "text",
        placeholder: "Enter Last Name",
        gridCols: 1,
    },
    {
        id: "learner_date_of_birth",
        label: "Date of Birth",
        inputType: "datepicker",
        placeholder: "MM/DD/YYYY",
        gridCols: 1,
    },
    {
        id: "learner_gender",
        label: "Gender",
        inputType: "radio",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to reveal", value: "not_specified" },
        ],
        gridCols: 1,
    },
    {
        id: "learner_preferred_pronoun",
        label: "Preferred Pronoun",
        inputType: "select",
        placeholder: "Select Pronoun",
        options: [
            { label: "He/Him", value: "he_him" },
            { label: "She/Her", value: "she_her" },
            { label: "They/Them", value: "they_them" },
        ],
        gridCols: 1,
    },
    {
        id: "learner_primary_language",
        label: "Primary Language",
        inputType: "select",
        placeholder: "Select language",
        gridCols: 1,
        options: [],
    },
    {
        parent: "learner_contact_details",
        id: "email",
        label: "Email Address",
        inputType: "text",
        placeholder: "Enter email",
        gridCols: 1,
    },
    {
        parent: "learner_contact_details",
        id: "contact_number",
        label: "Contact Number",
        inputType: "contact-input",
        sublabelAlignment: "right",
        gridCols: 1,
        disabled: false,
    },
];

// Disability-Specific Information Fields
const DisabilityInfoFields: FormField[] = [
    {
        id: "type_of_developmental_disability",
        label: "Type of Developmental Disability",
        sublabel: "(e.g., autism, down syndrome, ADHD, etc.)",
        inputType: "select",
        placeholder: "Select type",
        gridCols: 1,
    },
    {
        id: "level_of_support_needed",
        label: "Level of Support Needed",
        inputType: "radio",
        options: [
            { label: "Mild", value: "mild" },
            { label: "Moderate", value: "moderate" },
            { label: "Extensive", value: "extensive" },
        ],
        gridCols: 1,
        sublabel: " ",
        className: "w-full h-full mt-4",
    },
    {
        id: "assistive_device_used",
        label: "Assistive Devices Used",
        sublabel: "(E.g. , Hearing aids, Wheelchair)",
        inputType: "select",
        placeholder: "Select aids",
        gridCols: 1,
    },
    {
        id: "communication_style",
        label: "Communication Style",
        sublabel: "(e.g., verbal, sign language, AAC device)",
        inputType: "select",
        placeholder: "Select style",
        gridCols: 1,
    },
    {
        id: "description",
        label: "Description of Abilities and Strengths",
        inputType: "textarea",
        placeholder: "Describe here",
        gridCols: 2,
    },
    {
        id: "areas_of_support_needed",
        label: "Areas of Support Needed",
        sublabel: "(e.g., communication, motor skills, behavior, academic skills)",
        inputType: "multiselect",
        placeholder: "Select aids",
        gridCols: 1,
    },
    {
        id: "learning_styles",
        label: "Learning Style",
        sublabel: "(visual, auditory, hands-on, etc.)",
        inputType: "select",
        placeholder: "Select aids",
        gridCols: 1,
    },
];

// Education and Background Fields
const EducationBackgroundFields: FormField[] = [
    {
        id: "current_school",
        label: "Current School/Program",
        sublabel: "(name of school, grade level)",
        inputType: "text",
        placeholder: "Enter school name",
        gridCols: 1,
    },
    {
        id: "iep_plan_key",
        label: "IEP or 504 Plan",
        sublabel: "(if applicable, include key details or goals)",
        inputType: "text",
        placeholder: "(appropriate relative to developmental level)",
        gridCols: 1,
    },
    {
        id: "academic_strengths",
        label: "Academic Strengths",
        sublabel: "(subjects the child enjoys or does well in)",
        inputType: "select",
        placeholder: "Describe strengths",
        gridCols: 1,
    },
    {
        id: "academic_challenges",
        label: "Academic Challenges",
        sublabel: "(subjects where the child may need extra support)",
        inputType: "select",
        placeholder: "Describe what areas need extra support",
        gridCols: 1,
    },
];

// Behavior and Social Skills Fields
const BehaviorSocialFields: FormField[] = [
    {
        id: "communication_preferences",
        label: "Communication Preferences",
        sublabel: "(visual, nonverbal, assistive devices)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "social_interaction_styles",
        label: "Social Interaction Style",
        sublabel: "(engaging, shy, prefers one-on-one group settings)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "behavioral_concerns",
        label: "Behavioral Concerns",
        sublabel: "(e.g., triggers, behaviors, suggested responses)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "techniques_to_calm",
        label: "Techniques That Work",
        sublabel: "(e.g., positive reinforcement, breaks)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
];

// Interests and Hobbies Fields
const InterestsHobbiesFields: FormField[] = [
    {
        id: "interests",
        label: "Main Interests",
        sublabel: "(e.g., music, art, sports, technology)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "extra_curricular_activities",
        label: "Computer Activities",
        sublabel: "(current or past participation)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "favorite_activities",
        label: "Favorite Activities",
        sublabel: "(activities that motivate the child)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
];

// Expectations and Goals Fields
const ExpectationsGoalsFields: FormField[] = [
    {
        id: "expected_goals",
        label: "Parent/Guardian’s Goals for the Child ",
        sublabel: "(e.g., improve social skills, academic progress, explore new hobbies)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "subjects_to_focus_on",
        label: "Specific Subject/Skill Preferences",
        sublabel: "(areas focus for tutoring or support)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "preferred_volunteer_qualities",
        label: "Preferred Volunteer Qualities",
        sublabel: "(any specific traits the parent/guardian values in a tutor or mentor)",
        inputType: "multiselect",
        placeholder: "Enter here",
        gridCols: 1,
    },
    {
        id: "skill_level",
        label: "Skill Level",
        inputType: "radio",
        options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Expert", value: "expert" },
        ],
        gridCols: 1,
        className: "w-full h-fit mt-4 gap-0 !mb-0",
        inputClassName: "w-full h-full  mt-4",

    },
];

// Additional Information Fields
const AdditionalInfoFields: FormField[] = [
    {
        id: "cultural_consideration",
        label: "Cultural/Religious Considerations",
        sublabel: "(if applicable for the program)",
        inputType: "text",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "other_concerns_or_requests",
        label: "Other Comments or Notes",
        sublabel: "(anything else the program should know)",
        inputType: "text",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "what_motivates_to_learn",
        label: "What motivates you to learn this subject? Do you have any specific goals or interests that you would like to focus in our lessons?",
        sublabel: "(anything else the program should know)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
];

export const LearnerFormSections: FormSectionConfig[] = [
    {
        parent: "parent_info",
        title: "Parent/Guardian Information",
        fields: ParentGuardianFields,
    },
    {
        parent: "learner_personal_info",
        title: "Learner's Personal Information",
        fields: LearnerPersonalFields,
    },
    {
        parent: "learner_special_needs",
        title: "Disability-Specific Information",
        fields: DisabilityInfoFields,
    },
    {
        parent: "education",
        title: "Education and Background",
        fields: EducationBackgroundFields,
    },
    {
        parent: "social_skills",
        title: "Behavior and Social Skills",
        fields: BehaviorSocialFields,
    },
    {
        parent: "current_interests",
        title: "Current Interests and Hobbies",
        fields: InterestsHobbiesFields,
    },
    {
        parent: "learner_goals",
        title: "Expectations and Goals",
        fields: ExpectationsGoalsFields,
    },
    {
        title: "Consent and Permissions",
        parent: "consent_and_permissions",
        fields: [
            {
                id: "photo_or_video_consent",
                label: "Photo/Video Consent",
                sublabel: "(for use in program materials or promotional content)",
                inputType: "radio",
                options: [
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                ],
                required: false,
                gridCols: 1,
            },
            {
                id: "acknowledgement_of_program_policies",
                label: "Acknowledgment of Program Policies ",
                sublabel: "(Rules, Expectations, and Procedures)",
                options: [
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                ],
                inputType: "radio",
                gridCols: 1,
            },
        ],
    },
    {
        parent: "additional_info",
        title: "Additional Information",
        fields: AdditionalInfoFields,
    },
];
