import React from "react";
import PrivacyPolicyHeader from "@/components/consents/privacy-policy/header";
import PrivacyPolicySections from "@/components/consents/privacy-policy/sections";

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-5">
            <PrivacyPolicyHeader />
            <PrivacyPolicySections />
        </div>
    ) 
};

export default PrivacyPolicy;