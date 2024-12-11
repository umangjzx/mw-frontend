"use client";

import FormSection from "@/components/onboarding/FormSection";
import { learnerFormSchema, volunteerFormSchema } from "@/components/onboarding/FormSection/config";
import InfoSection from "@/components/onboarding/InfoSection";
import { VolunteerOnboardingConstants } from "@/constants/volunteer";
import TitleSection from "@/components/onboarding/TitleSection";
import { LearnerFormSections, LearnerOnboardingConstants } from "@/constants/learner";
import { VolunteerFormSections } from "@/constants/volunteer";

export default function OnboardingPage () {
    const role = localStorage.getItem("role");

    const titleSectionConstants =
        role === "volunteer" ? VolunteerOnboardingConstants : LearnerOnboardingConstants;
    const formData = role === "volunteer" ? VolunteerFormSections : LearnerFormSections;
    const schema = role === "volunteer" ? volunteerFormSchema : learnerFormSchema;

    return (
        <div className='flex bg-background-input flex-col gap-5'>
            <TitleSection
                title={titleSectionConstants.title}
                description={titleSectionConstants.description}
            />
            {role === "volunteer" && <InfoSection />}
            <FormSection schema={schema} formData={formData} />
        </div>
    );
}
