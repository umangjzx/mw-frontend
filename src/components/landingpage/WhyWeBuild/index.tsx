import React from "react";
import Card from "./Card";
import ContainerWrapper from "../components/ContainerWrapper";
import { cardData } from "@/constants/landingPage";
const WhyWeBuild = () => {
    return (
        <ContainerWrapper>
            <h1 className="text-[2rem] font-medium">Why are we building this?</h1>
            <div className="flex items-center justify-center gap-7 ">
                {cardData.map((item, index) => (
                    <Card key={index} title={item.title} description={item.description} index={index} />
                ))}
            </div>
        </ContainerWrapper>
    );
};

export default WhyWeBuild;
