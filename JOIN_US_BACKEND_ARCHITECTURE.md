# Join Us Backend Payload Guide

This file explains what payload to send to backend for the 3-step Join Us form.

## High-Level Flow (3 Endpoints)

1. `POST /api/v1/join-us/step-1`  
   Save basic details + compensation preference.
2. `POST /api/v1/join-us/step-2`  
   Save selected role.
3. `POST /api/v1/join-us/step-3`  
   Save answers, legal/safety info, and final consent.

Use one `application_id` across all steps so backend can link the same application.

---

## Step 1 Architecture

### Endpoint

- **Method:** `POST`
- **Path:** `/api/v1/join-us/step-1`
- **Purpose:** Save user basic profile for step 1.

### Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (optional, only if your flow is authenticated)

### Step 1 Payload (snake_case)

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": {
    "country_code": "+1",
    "number": "4151234567"
  },
  "date_of_birth": "2004-08-12",
  "address": {
    "country": "US",
    "state": "CA"
  },
  "linkedin_or_portfolio_url": "https://www.linkedin.com/in/johndoe",
  "education": {
    "school_or_university": "Stanford University",
    "grade_level_or_year": "3rd Year"
  },
  "current_employment_details": "Part-time tutor",
  "compensation_expectation": "Open to stipend when available",
  "compensation_preference": "unpaid_ok"
}
```

### Field Mapping from UI (`step-1/page.tsx`)

- `full_name` <- `full_name`
- `email` <- `email`
- `phone.country_code` <- `phone_country_code`
- `phone.number` <- `phone_number`
- `date_of_birth` <- `date_of_birth` (UI shows `dd/mm/yyyy`; convert to `YYYY-MM-DD` before send)
- `address.country` <- `country`
- `address.state` <- `state`
- `linkedin_or_portfolio_url` <- `linkedin`
- `education.school_or_university` <- `school`
- `education.grade_level_or_year` <- `grade_level`
- `current_employment_details` <- `employment_details`
- `compensation_expectation` <- `compensation`
- `compensation_preference` <- `compensation_preference` (`unpaid_ok` | `paid_only`)

### Validation Rules (Backend)

- `full_name`: required, 2 to 120 chars
- `email`: required, valid email
- `phone.country_code`: required, allowed codes (`+1`, `+91` for now)
- `phone.number`: required, numbers only, 7 to 15 digits
- `date_of_birth`: required, format `YYYY-MM-DD`
- `address.country`: required (best to use ISO-2 code)
- `address.state`: required
- `linkedin_or_portfolio_url`: optional, must be valid URL if sent
- `education.school_or_university`: optional, max 200 chars
- `education.grade_level_or_year`: optional, max 100 chars
- `current_employment_details`: optional, max 500 chars
- `compensation_expectation`: optional, max 300 chars
- `compensation_preference`: required, values: `unpaid_ok` or `paid_only`

### Response (Success)

```json
{
  "success": true,
  "message": "Step 1 saved successfully",
  "data": {
    "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
    "current_step": 1,
    "next_step": 2
  }
}
```

### Response (Validation Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "compensation_preference",
      "message": "Please choose a valid option"
    }
  ]
}
```

---

## Step 3 Architecture

### Endpoint

- **Method:** `POST`
- **Path:** `/api/v1/join-us/step-3`
- **Purpose:** Save application answers, legal/safety details, and final consent.

### Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (optional)

### Step 3 Payload (snake_case)

```json
{
  "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
  "application_questions": {
    "looking_for_internship": "yes",
    "interest_in_melodywings": "I want to support neurodivergent learners.",
    "interest_in_selected_role": "I enjoy outreach and community support.",
    "relevant_experience": "Volunteer teaching, school clubs, NGO events.",
    "skills_for_role": "Communication, planning, content writing.",
    "hours_per_week": "10",
    "available_start_date": "2026-04-01",
    "children_or_neurodivergent_experience": "Yes, I have worked with children for 1 year.",
    "additional_information": "Available on weekends too."
  },
  "legal_and_safety": {
    "criminal_background_check": {
      "convicted_felony_or_misdemeanor": "no",
      "criminal_activity_or_pending_cases": "no",
      "crime_involving_minors_abuse_neglect": "no",
      "details_if_yes": ""
    },
    "sex_offender_registry_check": {
      "listed_on_registry": "no",
      "details_if_yes": ""
    },
    "disciplinary_history": {
      "terminated_for_misconduct": "no",
      "dispute_related_to_safety_or_ethics": "no",
      "academic_or_professional_disciplinary_action": "no",
      "details_if_yes": ""
    },
    "health_and_safety": {
      "condition_affecting_volunteer_duties": "no",
      "details_if_yes": ""
    },
    "consents": {
      "agree_child_abuse_and_registry_checks": "yes",
      "agree_confidentiality_behavior_safeguarding_policies": "yes",
      "understand_role_termination_if_policy_breach_or_criminal_activity": "yes",
      "details_if_no": ""
    },
    "previous_volunteer_experience": {
      "incidents_or_complaints_in_previous_roles": "no",
      "details_if_yes": ""
    }
  },
  "permissions": {
    "photo_video_consent": "yes",
    "terms_accepted": true
  }
}
```

### Field Mapping from UI (`step-3/page.tsx`)

- `application_questions.looking_for_internship` <- `isInternship`
- `application_questions.hours_per_week` <- `hoursAvailable`
- `application_questions.available_start_date` <- `startDate`
- `legal_and_safety.criminal_background_check.convicted_felony_or_misdemeanor` <- `criminalCheck1`
- `legal_and_safety.criminal_background_check.criminal_activity_or_pending_cases` <- `criminalCheck2`
- `legal_and_safety.criminal_background_check.crime_involving_minors_abuse_neglect` <- `criminalCheck3`
- `legal_and_safety.sex_offender_registry_check.listed_on_registry` <- `sexOffenderCheck`
- `legal_and_safety.disciplinary_history.terminated_for_misconduct` <- `disciplinary1`
- `legal_and_safety.disciplinary_history.dispute_related_to_safety_or_ethics` <- `disciplinary2`
- `legal_and_safety.disciplinary_history.academic_or_professional_disciplinary_action` <- `disciplinary3`
- `legal_and_safety.health_and_safety.condition_affecting_volunteer_duties` <- `healthCheck`
- `legal_and_safety.consents.agree_child_abuse_and_registry_checks` <- `consent1`
- `legal_and_safety.consents.agree_confidentiality_behavior_safeguarding_policies` <- `consent2`
- `legal_and_safety.consents.understand_role_termination_if_policy_breach_or_criminal_activity` <- `consent3`
- `legal_and_safety.previous_volunteer_experience.incidents_or_complaints_in_previous_roles` <- `previousVolunteer`
- `permissions.photo_video_consent` <- `photoConsent`
- `permissions.terms_accepted` <- `termsAccepted`

Notes:
- There are multiple textarea questions in Step 3 UI that are not yet connected to state in code. Keep matching payload keys and wire them from frontend when you connect those fields.
- Radio values should be `yes` or `no`.

### Simple Backend Rules

- `application_id`: required
- `permissions.terms_accepted`: must be `true` for final submit
- all radio fields: required, only `yes` or `no`
- `details_if_yes`: required when related answer is `yes`
- `details_if_no`: required when any mandatory consent answer is `no`
- long text fields: optional but recommended (set max length, e.g., 2000)
- `available_start_date`: optional, but if sent use `YYYY-MM-DD`

### Response (Success)

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
    "current_step": 3,
    "status": "submitted"
  }
}
```

### Response (Validation Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "permissions.terms_accepted",
      "message": "You must accept terms to submit"
    },
    {
      "field": "legal_and_safety.consents.details_if_no",
      "message": "Please provide details when consent answer is no"
    }
  ]
}
```

### Persistence Model Suggestion (Step 1)

Save Step 1 in one application record:

- `applications.id` -> `application_id`
- `applications.status` -> `in_progress`
- `applications.current_step` -> `1`
- `applications.step1_payload` -> JSON blob or normalized columns
- `applications.created_at`, `applications.updated_at`

---

## Contract for Step 2 and Step 3 (Skeleton)

For consistency, Step 2 and Step 3 should include:

```json
{
  "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
  "...stepSpecificPayload": "..."
}
```

This makes sure all 3 steps update the same application.

---

## Step 2 Architecture

### Endpoint

- **Method:** `POST`
- **Path:** `/api/v1/join-us/step-2`
- **Purpose:** Save selected position/role.

### Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (optional)

### Step 2 Payload (snake_case)

```json
{
  "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
  "selected_position": "social_media_intern",
  "custom_role_description": ""
}
```

### Allowed values for `selected_position`

- `social_media_intern`
- `volunteer_outreach_intern`
- `learner_outreach_intern`
- `operations_intern`
- `partnerships_intern`
- `other_custom_role`

### Field Mapping from UI (`step-2/page.tsx`)

- `selected_position` <- `selectedPosition`
- `custom_role_description` <- `customRole`

### Simple Backend Rules

- `application_id`: required
- `selected_position`: required, must be one of allowed values
- `custom_role_description`:
  - required only when `selected_position = other_custom_role`
  - optional for all other positions
  - max 1000 chars

### Response (Success)

```json
{
  "success": true,
  "message": "Step 2 saved successfully",
  "data": {
    "application_id": "app_01JXYZ8A2M6P9Q4R3T7U",
    "current_step": 2,
    "next_step": 3
  }
}
```

### Response (Validation Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "selected_position",
      "message": "Please select a valid position"
    },
    {
      "field": "custom_role_description",
      "message": "This field is required when selected_position is other_custom_role"
    }
  ]
}
```
succes:
/join-us/success