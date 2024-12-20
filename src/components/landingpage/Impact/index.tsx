import React from "react";
import ContainerWrapper from "../components/ContainerWrapper";
import ContainerHeader from "../components/ContainerHeader";
import { gradientInnerTextStyle, imapactData } from "@/constants/landingPage";

const Impact = () => {
    return (
        <ContainerWrapper>
            <div className="flex flex-col gap-10 w-full">
                <ContainerHeader
                    title="Our Impact So Far"
                    subTitle="Together, We're Making a Difference"
                    description="Here's how our community is spreading knowledge and bringing change."
                />
                <div className="bg-[#f4f7fb] shadow-inner rounded-3xl p-6 py-20 grid grid-cols-3 place-items-center w-full">
                    {imapactData.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <span
                                style={gradientInnerTextStyle}
                                className="text-[4rem] font-semibold tracking-tighter"
                            >
                                {item.title}
                            </span>
                            <p className="text-xl font-medium -mt-2">{item.subTitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default Impact;
