"use client";

import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerThankyouCardConstants } from "@/constants/volunteer";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useState } from "react";
export default function VerificationPage() {
    const role = Cookies.get("role");

    const [id, setId] = useState<string>("");

    useEffect(() => {
        if (role === "volunteer") {
            setId("volunteer_id");
        } else {
            setId("learner_id");
        }
    }, [role]);

    const getOnboardingStatus = async () => {
        const response = await GET_API(endpoints.onboarding.getOnboardingStatus(id));
        return response.data;
    };

    const { data: onboardingStatus } = useQuery({
        queryKey: ["onboardingStatus"],
        queryFn: getOnboardingStatus,
    });

    console.log(onboardingStatus, "onboardingStatus");

    const thankyouCardConstants =
        role !== "volunteer" ? LearnerThankyouCardConstants : VolunteerThankyouCardConstants;

    return (
        <div className="flex h-[60dvh] bg-background-input items-center justify-center flex-col gap-5">
            <ThankyouCard
                title={thankyouCardConstants.title}
                description={thankyouCardConstants.description}
            />
        </div>
    );
}
