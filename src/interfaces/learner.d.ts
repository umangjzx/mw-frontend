interface Learner {
  learner_personal_info: Learnerpersonalinfo;
  learner_special_needs: Learnerspecialneeds;
  parent_info: Parentinfo;
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

interface Parentinfo {
  parent_name: string;
  parent_contact_number: Contactnumber;
  parent_address: string;
  emergency_contact_number: Contactnumber;
  relationship_to_learner: string;
  parent_email: string;

}

interface Learnerspecialneeds {
  learner_condition: string;
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
  contact_number: Contactnumber;
  zip_code: string;
}

interface Contactnumber {
  number: string;
  country_code: string;
}