import { LandingpageLayout } from "@/layouts";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
    return <LandingpageLayout>{children}</LandingpageLayout>;
}

export default Layout;
