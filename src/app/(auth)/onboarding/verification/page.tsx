"use client";

import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerThankyouCardConstants } from "@/constants/volunteer";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type UserRole = "volunteer" | "learner";
type OnboardingStatus = {
    status: "verification_pending" | "verification_completed";
};

export default function VerificationPage() {
    const router = useRouter();
    const role = Cookies.get("role") as UserRole;
    const currentId = role === "volunteer" ? "volunteer_id" : "learner_id";
    const id = Cookies.get(currentId);

    const { data: onboardingStatus, isLoading } = useQuery<
        OnboardingStatus,
        Error,
        OnboardingStatus
    >({
        queryKey: ["onboardingStatus", id],
        queryFn: () =>
            GET_API(endpoints.onboarding.getOnboardingStatus(id as string)).then((res) => res.data),
        enabled: !!id,
        refetchInterval: 60000,
        onSuccess: (data: OnboardingStatus) => {
            if (data?.status === "verification_completed") {
                router.push(`/${role}/schedule`);
            }
        },
    } as UseQueryOptions<OnboardingStatus, Error, OnboardingStatus>);

    if (!id) {
        router.push("/login");
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex h-[60dvh] bg-background-input items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const thankyouCardConstants =
        role === "learner" ? LearnerThankyouCardConstants : VolunteerThankyouCardConstants;

    return (
        <div className="flex h-[60dvh] bg-background-input items-center justify-center flex-col gap-5">
            <ThankyouCard
                title={thankyouCardConstants.title}
                description={thankyouCardConstants.description}
            />
        </div>
    );
}
