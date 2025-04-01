"use client";

import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerThankyouCardConstants } from "@/constants/volunteer";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UserRole = "volunteer" | "learner";
type OnboardingStatus = {
    onboarded_status: "verification_pending" | "verification_completed";
};

export default function VerificationPage() {
    const router = useRouter();

    const role = Cookies.get("role") as UserRole;
    const currentId = role === "volunteer" ? "volunteer_id" : "learner_id";
    const id = Cookies.get(currentId);

    useEffect(() => { if (!id) router.push("/login"); }, [id, router]);

    const getOnboardingStatus = async () => {
        const { data } = await GET_API(endpoints.onboarding.getOnboardingStatus(id as string, role));
        if (data?.onboarded_status === "verification_completed") {
            Cookies.set("onboarded_status", "verification_completed", { expires: 1 });
            router.push(`/${role}/schedule`);
        }
        return data;
    }

    const { isLoading } = useQuery<OnboardingStatus, Error>({
        queryKey: ["onboardingStatus", id, role],
        queryFn: getOnboardingStatus,
        enabled: !!id,
        refetchInterval: 15000,
    });

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