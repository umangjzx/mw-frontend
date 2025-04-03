"use client";

import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerRejectedMessage, VolunteerThankyouCardConstants } from "@/constants/volunteer";
import { getCookie } from "@/utils/auth";
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
    const onboarded_status = getCookie("onboarded_status");
    const currentId = role === "volunteer" ? "volunteer_id" : "learner_id";
    const id = Cookies.get(currentId);

    useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0 }) }, []);
    useEffect(() => { if (!id) router.push("/login"); }, [id, router]);

    const getOnboardingStatus = async () => {
        const { data } = await GET_API(endpoints.onboarding.getOnboardingStatus(id as string, role));
        const currentStatus = data?.onboarded_status;
        if (currentStatus === "verification_completed") {
            Cookies.set("onboarded_status", "verification_completed", { expires: 1 });
            router.push(`/${role}/schedule`);
        }else if(currentStatus === "verification_rejected"){
            Cookies.set("onboarded_status", "verification_rejected", { expires: 1 });
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

    const verificationContent = role === "learner" ? LearnerThankyouCardConstants : (onboarded_status === "verification_pending") ? VolunteerThankyouCardConstants : VolunteerRejectedMessage;

    return (
        <div className="flex min-h-[60dvh] bg-background-input items-center justify-center flex-col gap-5 md:px-10">
            <ThankyouCard
                title={verificationContent.title}
                description={verificationContent.description}
            />
        </div>
    );
}