export const TestimonialFormConstants: FormField[] = [
    {
        name: "comments",
        label: "Your Comments",
        inputType: "textarea",
        placeholder: "Enter comments here",
    },
    {
        name: "uploadPictures",
        label: "Do you want to upload any pictures to share in the community/forum?",
        inputType: "upload",
        maxFiles: 3,
    },
];

export const MessageModalConstants: FormField[] = [
    {
        name: "message",
        inputType: "textarea",
        placeholder: "Type message here",
        rows: 10,
    },
];

//* Volunteer Onboarding Form Fields
const ProfileDetailsFields: FormField[] = [
    {
        id: "volunteer_first_name",
        label: "First Name",
        inputType: "text",
        placeholder: "Eg. John",
        gridCols: 1,
    },
    {
        id: "volunteer_last_name",
        label: "Last Name",
        inputType: "text",
        placeholder: "Eg. John",
        gridCols: 1,
    },
    {
        id: "volunteer_birth_date",
        label: "Enter your birthday",
        inputType: "datepicker",
        placeholder: "MM/DD/YYYY",
        sublabel: "Minors must be at least 14 years of age to begin volunteering",
        gridCols: 1,
    },
    {
        id: "consented_from_parent",
        label: "",
        inputType: "checkbox",
        placeholder: "I've consent from my parent or guardian to be a volunteer.",
        gridCols: 1,
        inputClassName: "w-fit",
    },
    {
        id: "volunteer_parent_email",
        label: "Parent Email ID",
        inputType: "text",
        placeholder: "Enter Email ID",
        gridCols: 2,
        inputClassName: "!w-[49%]",
    },
    {
        id: "volunteer_gender",
        label: "Select Gender",
        inputType: "radio",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Do not wish to reveal", value: "not_specified" },
        ],
        gridCols: 2,
    },
    {
        id: "volunteer_higher_education",
        label: "Highest Education",
        inputType: "select",
        placeholder: "Select education level",
        options: [
            { label: "High School", value: "high_school" },
            { label: "Bachelor's Degree", value: "bachelors" },
            { label: "Master's Degree", value: "masters" },
            { label: "PhD", value: "phd" },
        ],
        gridCols: 1,
        inputClassName: "!w-full",
    },
    {
        id: "volunteer_languages",
        label: "Languages Spoken",
        inputType: "async-select",
        variant: "multi",
        placeholder: "English, Tamil, Hindi",
        endpoint: "languages",
        responseAsLabel: "language_name",
        responseAsValue: ["language_id", "language_name"],
        gridCols: 2,
        inputClassName: "!w-[49%]",
    },
    {
        id: "education_details",
        label: "Education",
        inputType: "text",
        placeholder: "Type here",
        gridCols: 2,
    },
    {
        id: "volunteer_experience",
        label: "Experience",
        inputType: "text",
        placeholder: "Type here",
        gridCols: 2,
    },
    {
        id: "volunteer_skills",
        label: "Skills and Expertise to Share",
        inputType: "async-select",
        placeholder: "Search and select skills",
        gridCols: 2,
        inputClassName: "!w-[49%]",
        endpoint: "skills",
        responseAsLabel: "skill_name",
        responseAsValue: ["skill_id", "skill_name"],
        variant: "multi",
    },
];

export const ContactDetailsFields: FormField[] = [
    {
        id: "email",
        label: "Email address",
        inputType: "text",
        placeholder: "Enter Email ID",
        gridCols: 1,
        disabled: false,
    },
    {
        id: "contact_number",
        label: "Your contact number",
        sublabel: "(with country code)",
        inputType: "contact-input",
        placeholder: "Enter Email ID",
        sublabelAlignment: "right",
        gridCols: 1,
        disabled: false,
    },
    {
        id: "zip_code",
        label: "Zip Code",
        inputType: "text",
        placeholder: "Enter Zip Code",
        gridCols: 1,
    },
];

const CriminalBackgroundCheckFields: FormField[] = [
    {
        id: "convicted_of_a_felony",
        label: "Have you ever been convicted of a felony or misdemeanor?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "involved_in_criminal_activity",
        label: "Have you ever been involved in any criminal activity or legal proceedings, including pending charges or arrests?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "convicted_of_a_crime",
        label: "Have you been convicted of any crimes involving minors, abuse, or neglect?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Mention here",
        gridCols: 2,
    },
];

const SexOffenderCheckFields: FormField[] = [
    {
        id: "sex_offender_check_details",
        label: "Are you listed on any state or national sex offender registries?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Mention here",
        gridCols: 2,
    },
];

const DisciplinaryCheckDetailsFields: FormField[] = [
    {
        id: "terminated_from_volunteer_position",
        label: "Have you ever been terminated or asked to resign from a volunteer or employment position for reasons related to misconduct or inappropriate behavior?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "involved_in_disputes",
        label: "Have you ever been involved in any disputes with employers or organizations related to safety or ethical issues?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "dismissed_from_institution",
        label: "Have you ever faced dismissal, suspension, probation, or any other disciplinary or academic action from a college, university, or professional school?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Describe here",
        gridCols: 2,
    },
];

const HealthSafetyAgreementFields: FormField[] = [
    {
        id: "having_health_issues",
        label: "Do you have any physical or mental health conditions that may affect your ability to perform volunteer duties?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Mention here",
        required: false,
        gridCols: 2,
    },
];

const OtherConsentsDetailsFields: FormField[] = [
    {
        id: "consent_to_background_checks",
        label: "Do you consent to a criminal background check, including child abuse registry and sex offender checks?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        required: false,
        gridCols: 2,
    },
    {
        id: "agree_to_follow_organization_policies",
        label: "Do you agree to follow the organization’s policies on confidentiality, behavior, and safeguarding procedures?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        required: false,
        gridCols: 2,
    },
    {
        id: "agree_to_understand_termination_of_volunteer_agreement",
        label: "Do you understand that your volunteer role may be terminated based on any criminal activity or failure to adhere to the organization's policies?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        required: false,
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Describe here",
        required: false,
        gridCols: 2,
    },
];

const VolunteerExperienceDetailsFields: FormField[] = [
    {
        id: "previously_volunteered",
        label: "Have you previously volunteered with children or vulnerable populations?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        required: false,
        gridCols: 2,
    },
    {
        id: "invloved_in_complaints",
        label: "Have you ever been involved in any incidents or complaints during previous volunteer roles?",
        inputType: "radio",
        options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ],
        required: false,
        gridCols: 2,
    },
    {
        id: "description",
        label: `Please describe the circumstance behind the "yes" answer above.`,
        inputType: "textarea",
        placeholder: "Describe here",
        required: false,
        gridCols: 2,
    },
];

export const VolunteerFormSections: FormSectionConfig[] = [
    {
        parent: null,
        title: "Profile Details",
        fields: ProfileDetailsFields,
    },
    {
        parent: "volunteer_contact_details",
        title: "Contact Details",
        fields: ContactDetailsFields,
    },
    {
        parent: "legal_and_safety_info",
        title: "Volunteer Application: Legal and Safety Information",
        fields: [
            {
                parent: "criminal_background_check_details",
                title: "Criminal Background Check",
                fields: CriminalBackgroundCheckFields,
            },
            {
                parent: "sex_offender_check_details",
                title: "Sex Offender Registry Check",
                fields: SexOffenderCheckFields,
            },
            {
                parent: "disciplinary_check_details",
                title: "Disciplinary History",
                fields: DisciplinaryCheckDetailsFields,
            },
            {
                parent: "health_and_safety_check_details",
                title: "Health and Safety Information",
                fields: HealthSafetyAgreementFields,
            },
            {
                parent: "other_consents_details",
                title: "Consents",
                fields: OtherConsentsDetailsFields,
            },
            {
                parent: "volunteer_experience_details",
                title: "Previous Volunteer Experience",
                fields: VolunteerExperienceDetailsFields,
            },
        ],
        type: "card",
    },
    {
        title: null,
        parent: null,
        fields: [
            {
                id: "volunteer_description",
                label: "Please provide two or three professional or personal references who can speak to your character and qualifications as a volunteer.",
                inputType: "textarea",
                placeholder: "Mention here",
                required: true,
                gridCols: 2,
            },
        ],
    },
    {
        //TODO: Need Clarification
        title: "Volunteer snapshot",
        fields: [
            {
                id: "volunteer_subjects",
                label: "Why do you want to tutor with us, and what do you hope to gain from this experience? What subjects would you like to teach, and why?",
                sublabel:
                    "Please share an overview of your profile, your areas of expertise and the reasons behind your choice, such as your passion for the subject or past teaching experience.",
                inputType: "async-select",
                placeholder: "Describe here",
                required: true,
                gridCols: 2,
                endpoint: "subjects",
                responseAsLabel: "subject_name",
                responseAsValue: ["subject_id", "subject_name"],
                variant: "multi",
            },
            {
                id: "profile_picture",
                label: "Profile Picture",
                inputType: "upload",
                required: false,
                gridCols: 1,
                variant: "file",
                fileType: "image/*",
            },
            {
                id: "profile_video",
                label: "Profile Video",
                sublabel:
                    "Record a Video summarizing your profile and qualifications. This will help the learners to get to know you better!  Feel free to share your hobbies, extracurricular activities, and explain how and why you believe you're well-suited to teach the subject you've chosen to special needs children. You can keep it casual ! Speak from the heart and share what feels natural.",
                inputType: "upload",
                required: false,
                gridCols: 2,
                variant: "file",
                fileType: "video/*",
            },
            {
                id: "profile_document",
                label: "ID Verification",
                sublabel:
                    "Please share an overview of your profile, your areas of expertise and the reasons behind your choice, such as your passion for the subject or past teaching experience.",
                inputType: "upload",
                required: false,
                gridCols: 2,
                variant: "file",
                fileType: "application/*",
            },
        ],
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
];

export const VolunteerOnboardingConstants = {
    title: "Join as a Volunteer",
    description:
        "Flexible schedules, meaningful impact—volunteer your way to help someone with special needs to discover their potential.",
};

export const VolunteerThankyouCardConstants = {
    title: "Thank You for Applying!",
    description:
        "We appreciate you considering this rewarding opportunity to change lives. MelodyWings team will verify the information provided in your application and thank you for your enthusiasm and willingness to make a difference in the lives of others.",
};
