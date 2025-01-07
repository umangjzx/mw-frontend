import { LogoIcon } from "@/assets/icons";
import HeroBannerImg from "@/assets/images/HeroBannerImg.png";
import HeroBannerMobileImg from "@/assets/images/HeroBannerMobileImg.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import LandingPageButton from "../components/Button";
import Header from "../components/Header";

interface HeroProps {
    handleSetRole: (newRole: UserType) => void;
    buttonLoading: string;
}

const Hero = ({ handleSetRole, buttonLoading }: HeroProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            className={`w-full h-full transition-opacity duration-1000 ease-in-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <Header handleModalLogin={(value) => handleSetRole(value as UserType)} />
            <div className={`w-full md:h-[80vh] md:bg-white relative`}>
                <div className="w-full !h-[300px] md:!h-full md:!relative">
                    <Image src={HeroBannerImg} alt="Hero Banner" fill className="h-full object-cover hidden md:block" />
                    <Image src={HeroBannerMobileImg} alt="Hero Banner" fill className="!h-[300px] md:hidden object-cover" />
                </div>
                <div className="md:!w-[40%] md:!h-[30%] md:!absolute md:!top-[25%] md:!left-[10%] z-10 flex-center flex-col md:items-start md:justify-start gap-6">
                    <span>
                        <LogoIcon />
                    </span>
                    <h1 className="px-5 md:px-0 text-2xl lg:text-4xl text-center md:!text-start font-medium !leading-normal">
                        Limitless free learning <br /> opportunities for diverse <br />
                        disabilities
                    </h1>
                    <div className="flex flex-col md:flex-row gap-3">
                        <LandingPageButton
                            loading={buttonLoading === "learner"}
                            onClick={() => handleSetRole("learner")}
                            title="Enroll as Learner"
                            type="learner"
                        />
                        <LandingPageButton
                            loading={buttonLoading === "volunteer"}
                            onClick={() => handleSetRole("volunteer")}
                            title="Become a Volunteer"
                            type="volunteer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
