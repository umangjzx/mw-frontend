interface Learner {
    parent_info: Parentinfo;
    learner_personal_info: Learnerpersonalinfo;
    learner_special_needs: Learnerspecialneeds;
    education: Education;
    social_skills: Socialskills;
    current_interests: Currentinterests;
    learner_goals: Learnergoals;
    additional_info: Additionalinfo;
    consent_and_permissions: Consentandpermissions;
}

interface Consentandpermissions {
    photo_or_video_consent: boolean;
    acknowledgement_of_program_policies: boolean;
}

interface Additionalinfo {
    cultural_consideration: string;
    other_concerns_or_requests: string;
    what_motivates_to_learn: string;
}

interface Learnergoals {
    expected_goals: string[];
    subjects_to_focus_on: string[];
    preferred_volunteer_qualities: string[];
    skill_level: string;
}

interface Currentinterests {
    interests: string[];
    extra_curricular_activities: string[];
    favorite_activities: string[];
}

interface Socialskills {
    communication_preferences: string[];
    social_interaction_styles: string[];
    behavioral_concerns: string[];
    techniques_to_calm: string[];
}

interface Education {
    current_school: string;
    iep_plan_key: string;
    academic_strengths: string[];
    academic_challenges: string[];
}

interface Learnerspecialneeds {
    type_of_developmental_disability: string;
    level_of_support_needed: string;
    assistive_device_used: string;
    communication_style: string;
    description: string;
    areas_of_support_needed: string[];
    learning_styles: string[];
}

interface Learnerpersonalinfo {
    learner_first_name: string;
    learner_last_name: string;
    learner_date_of_birth: string;
    learner_gender: string;
    learner_preferred_pronoun: string;
    learner_primary_language: string;
    learner_contact_details: Learnercontactdetails;
}

interface Learnercontactdetails {
    email: string;
    contact_number: Parentcontactnumber;
    zip_code: string;
}

interface Parentinfo {
    parent_first_name: string;
    parent_last_name: string;
    parent_contact_number: Parentcontactnumber;
    parent_address: string;
    emergency_contact_number: Parentcontactnumber;
    relationship_to_learner: string;
    parent_email: string;
}

interface Parentcontactnumber {
    number: string;
    country_code: string;
}
