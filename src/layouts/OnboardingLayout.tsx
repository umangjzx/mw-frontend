import Footer from "@/components/onboarding/Footer";
import Header from "@/components/onboarding/Header";
import { FC, PropsWithChildren } from "react";

const OnboardingLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='h-screen w-screen flex flex-col'>
            <Header />
            <div className='flex-1'>{children}</div>
            <Footer />
        </div>
    );
};

export default OnboardingLayout;
