export const LearnerOnboardingConstants = {
    title: "Enroll a learner",
    description: "Thank you for your interest in joining Melody Wings. Fill out the form below and we'll get you a good fit.",
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
        label: "Emergency Contact Number",
        sublabel: "(with country code)",
        sublabelAlignment: "right",
        inputType: "parent",
        gridCols: 1,
        children: [
            {
                id: "country_code",
                label: "Country Code",
                inputType: "text",
                placeholder: "+1",
                gridCols: 1,
            },
            {
                id: "number",
                label: "Phone Number",
                inputType: "text",
                placeholder: "Enter number",
                gridCols: 1,
            },
        ],
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
        id: "date_of_birth",
        label: "Date of Birth",
        inputType: "datepicker",
        placeholder: "MM/DD/YYYY",
        gridCols: 1,
    },
    {
        id: "gender",
        label: "Gender",
        inputType: "radio",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to reveal", value: "not_specified" },
        ],
        gridCols: 2,
    },
    {
        id: "native_language",
        label: "Native Language",
        inputType: "select",
        placeholder: "Select language",
        gridCols: 1,
    },
    {
        id: "person_language",
        label: "Person's Language",
        inputType: "select",
        placeholder: "English",
        gridCols: 1,
    },
];

// Disability-Specific Information Fields
const DisabilityInfoFields: FormField[] = [
    {
        id: "disability_type",
        label: "Type of Developmental Disability",
        sublabel: "(e.g., autism, down syndrome, ADHD, etc.)",
        inputType: "select",
        placeholder: "Select type",
        gridCols: 2,
    },
    {
        id: "support_needed",
        label: "Level of Support Needed",
        inputType: "radio",
        options: [
            { label: "Mild", value: "mild" },
            { label: "Moderate", value: "moderate" },
            { label: "Extensive", value: "extensive" },
        ],
        gridCols: 2,
    },
    {
        id: "learning_aids",
        label: "Learning Aids",
        sublabel: "(e.g., hearing aids, visual aids)",
        inputType: "select",
        placeholder: "Select aids",
        gridCols: 2,
    },
    {
        id: "communication_style",
        label: "Communication Style",
        sublabel: "(e.g., verbal, sign language, AAC device)",
        inputType: "select",
        placeholder: "Select style",
        gridCols: 2,
    },
    {
        id: "strengths_description",
        label: "Description of Abilities and Strengths",
        inputType: "textarea",
        placeholder: "Describe here",
        gridCols: 2,
    },
];

// Education and Background Fields
const EducationBackgroundFields: FormField[] = [
    {
        id: "current_school",
        label: "Current School/Program",
        inputType: "text",
        placeholder: "Enter school name",
        gridCols: 1,
    },
    {
        id: "grade_level",
        label: "Grade or Skill level",
        inputType: "text",
        placeholder: "(appropriate relative to developmental level)",
        gridCols: 1,
    },
    {
        id: "academic_strengths",
        label: "Academic Strengths",
        inputType: "textarea",
        placeholder: "Describe strengths",
        gridCols: 2,
    },
    {
        id: "academic_challenges",
        label: "Academic Challenges",
        inputType: "textarea",
        placeholder: "Describe what areas need extra support",
        gridCols: 2,
    },
];

// Behavior and Social Skills Fields
const BehaviorSocialFields: FormField[] = [
    {
        id: "communication_preferences",
        label: "Communication Preferences",
        sublabel: "(visual, nonverbal, assistive devices)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "social_interaction",
        label: "Social Interaction Style",
        sublabel: "(engaging, shy, prefers one-on-one group settings)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "behavioral_concerns",
        label: "Behavioral Concerns",
        sublabel: "(e.g., triggers, behaviors, suggested responses)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "techniques_that_work",
        label: "Techniques That Work",
        sublabel: "(e.g., positive reinforcement, breaks)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
];

// Interests and Hobbies Fields
const InterestsHobbiesFields: FormField[] = [
    {
        id: "main_interests",
        label: "Main Interests",
        sublabel: "(e.g., music, art, sports, technology)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "favorite_activities",
        label: "Favorite Activities",
        sublabel: "(activities that motivate the child)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "computer_activities",
        label: "Computer Activities",
        sublabel: "(current or past participation)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
];

// Expectations and Goals Fields
const ExpectationsGoalsFields: FormField[] = [
    {
        id: "learning_goals",
        label: "What the Student Hopes to Achieve",
        sublabel: "(e.g., improve social skills, academic progress, explore new hobbies)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "support_preferences",
        label: "Specific Support/Aid Preferences",
        sublabel: "(areas focus for tutoring or support)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "skill_level",
        label: "Preferred Tutor/User Qualities",
        inputType: "radio",
        options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Expert", value: "expert" },
        ],
        gridCols: 2,
    },
];

// Additional Information Fields
const AdditionalInfoFields: FormField[] = [
    {
        id: "cultural_considerations",
        label: "Cultural/Religious Considerations",
        sublabel: "(if applicable for the program)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
    {
        id: "other_notes",
        label: "Other Comments or Notes",
        sublabel: "(anything else the program should know)",
        inputType: "textarea",
        placeholder: "Enter here",
        gridCols: 2,
    },
];

export const LearnerFormSections: FormSectionConfig[] = [
    {
        parent: null,
        title: "Parent/Guardian Information",
        fields: ParentGuardianFields,
    },
    {
        parent: null,
        title: "Learner's Personal Information",
        fields: LearnerPersonalFields,
    },
    {
        parent: null,
        title: "Disability-Specific Information",
        fields: DisabilityInfoFields,
    },
    {
        parent: null,
        title: "Education and Background",
        fields: EducationBackgroundFields,
    },
    {
        parent: null,
        title: "Behavior and Social Skills",
        fields: BehaviorSocialFields,
    },
    {
        parent: null,
        title: "Current Interests and Hobbies",
        fields: InterestsHobbiesFields,
    },
    {
        parent: null,
        title: "Expectations and Goals",
        fields: ExpectationsGoalsFields,
    },
    {
        parent: null,
        title: "Additional Information",
        fields: AdditionalInfoFields,
    },
];
