import React from "react";
import Header from "@/components/landingpage/components/Header";
import { FC, PropsWithChildren } from "react";
import Footer from "@/components/onboarding/Footer";

const LandingpageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div>
            <Header />
			<div className="w-full h-full bg-[#F4F7FB] md:bg-background-input">{children}</div>
            <Footer />
        </div>
    );
};

export default LandingpageLayout;
