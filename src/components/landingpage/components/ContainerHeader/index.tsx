import React from "react";
import { gradientTextStyle } from "@/constants/landingPage";

interface ContainerHeaderProps {
    title: string;
    subTitle?: string;
    description: string;
    titleColor?: string;
}

const ContainerHeader = ({ title, subTitle, description, titleColor }: ContainerHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 items-center">
            <p
                className={`text-xl font-semibold ${titleColor ? titleColor : ""}`}
                style={titleColor ? {} : gradientTextStyle}
            >
                {title}
            </p>
            <h2 className="text-[2rem] font-medium text-center leading-normal">{subTitle}</h2>
            <p className="text-xl text-gray-light text-center leading-normal">{description}</p>
        </div>
    );
};

export default ContainerHeader;
