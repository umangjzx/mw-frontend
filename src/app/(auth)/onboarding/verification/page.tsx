"use client";

import { endpoints } from "@/api/constants";
import { GET_API, PUT_API } from "@/api/request";
import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerThankyouCardConstants } from "@/constants/volunteer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UserRole = "volunteer" | "learner";
type OnboardingStatus = {
    onboarded_status: "verification_pending" | "verification_completed";
};

export default function VerificationPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Retrieve role and ID from cookies
    const role = Cookies.get("role") as UserRole;
    const currentId = role === "volunteer" ? "volunteer_id" : "learner_id";
    const id = Cookies.get(currentId);

    // Redirect if no ID is found
    useEffect(() => {
        if (!id) router.push("/login");
    }, [id, router]);

    // Fetch onboarding status
    const { data: onboardingStatus, isLoading } = useQuery<OnboardingStatus, Error>({
        queryKey: ["onboardingStatus", id],
        queryFn: () =>
            GET_API(endpoints.onboarding.getOnboardingStatus(id as string, role)).then((res) => res.data),
        enabled: !!id,
        refetchInterval: 30000,
    });

    // Update onboarding status when the page loads
    useEffect(() => {
        if (id && role === "learner") {
            PUT_API(endpoints.onboarding.setLearnerOnboardingStatus(id), {})
                .then(() => queryClient.invalidateQueries({ queryKey: ["onboardingStatus"] }))
                .catch((error) => console.error("Failed to update onboarding status:", error));
        }
    }, [id, role, queryClient]);

    useEffect(() => {
        if (onboardingStatus?.onboarded_status === "verification_completed") {
            Cookies.set("onboarded_status", onboardingStatus.onboarded_status, { expires: 30 });
            router.push(`/${role}/schedule`);
        }
    }, [onboardingStatus, role, router]);

    if (isLoading) {
        return (
            <div className="flex h-[60dvh] bg-background-input items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const thankyouCardConstants = role === "learner" ? LearnerThankyouCardConstants : VolunteerThankyouCardConstants;

    return (
        <div className="flex min-h-[60dvh] bg-background-input items-center justify-center flex-col gap-5 md:px-10">
            <ThankyouCard
                title={thankyouCardConstants.title}
                description={thankyouCardConstants.description}
            />
        </div>
    );
}