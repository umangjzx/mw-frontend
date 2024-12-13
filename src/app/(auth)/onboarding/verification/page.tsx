"use client";

import ThankyouCard from "@/components/landingpage/ThankyouCard";
import { LearnerThankyouCardConstants } from "@/constants/learner";
import { VolunteerThankyouCardConstants } from "@/constants/volunteer";
import Cookies from "js-cookie";
export default function VerificationPage () {
    const role = Cookies.get("role");
    const thankyouCardConstants =
        role !== "volunteer" ? LearnerThankyouCardConstants : VolunteerThankyouCardConstants;

    return (
        <div className='flex h-[60dvh] bg-background-input items-center justify-center flex-col gap-5'>
            <ThankyouCard
                title={thankyouCardConstants.title}
                description={thankyouCardConstants.description}
            />
        </div>
    );
}
