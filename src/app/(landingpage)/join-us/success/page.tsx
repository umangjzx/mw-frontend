"use client";

import { ThankyouCardBase } from "@/components/landingpage/ThankyouCard";

const JoinUsSuccessPage = () => {
    return (
        <div className="flex min-h-[60dvh] bg-background-input items-center justify-center flex-col gap-5 md:px-10">
            <ThankyouCardBase
                title="Thank You for Your Application!"
                description="Thank you for applying to join Melody Wings. We appreciate your interest and enthusiasm in becoming part of our community. Our team will review your application and get back to you soon. We look forward to connecting with you and exploring the possibilities ahead."
            />
        </div>
    );
};

export default JoinUsSuccessPage;