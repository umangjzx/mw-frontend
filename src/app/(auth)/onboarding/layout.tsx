import OnboardingLayout from "@/layouts/OnboardingLayout";
import React from "react";

function Layout ({ children }: { children: React.ReactNode }) {
    return <OnboardingLayout>{children}</OnboardingLayout>;
}

export default Layout;
