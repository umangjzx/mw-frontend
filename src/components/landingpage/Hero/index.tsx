import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Image from "next/image";
import HeroBannerImg from "@/assets/images/HeroBannerImg.png";
import { LogoIcon } from "@/assets/icons";
import Button from "../components/Button";
import LandingPageButton from "../components/Button";

const Hero = () => {
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
            <Header />
            <div className={`w-full h-[80vh] bg-white relative`}>
                <div className="w-full h-full relative">
                    <Image src={HeroBannerImg} alt="Hero Banner" fill className="object-cover" />
                </div>
                <div className="w-[40%] h-[30%] absolute top-[25%] left-[10%] z-10 flex flex-col gap-6">
                    <span>
                        <LogoIcon />
                    </span>
                    <h1 className="text-4xl font-medium leading-normal">
                        Limitless free learning <br /> opportunities for diverse <br />
                        disabilities
                    </h1>
                    <div className="flex gap-3">
                        <LandingPageButton title="Enroll as Learner" type="learner" />
                        <LandingPageButton title="Become a Volunteer" type="volunteer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
