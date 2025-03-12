"use client";
import React from "react";
import Image from "next/image";
import LineImage from "@/assets/images/LineImg.png";
import LineImageVertical from "@/assets/images/LineImgVertical.png";
import useInnerWidth from "@/hooks/useInnerWidth";

interface StepsChartProps {
    title: string;
    icon: React.ReactNode;
    iconMobile: React.ReactNode;
    index: number;
}

const StepsChart = ({ title, icon, iconMobile, index }: StepsChartProps) => {
    const innerWidth = useInnerWidth();
    return (
        <div
            key={index}
            className="flex flex-col lg:items-center relative gap-4 w-full lg:max-w-[17rem] h-[100px] lg:h-[170px]"
        >
            <div className="flex flex-row items-center w-full lg:ml-[70%]">
                <div className="rounded-full z-10 mr-2 md:mr-3 lg:mr-0">
                    {innerWidth > 768 ? icon : iconMobile}
                </div>
                {index !== 3 && (
                    <div className="relative hidden lg:block w-full h-0.5">
                        <Image src={LineImage} alt="Line" className="w-full" fill />
                    </div>
                )}
                <p className="lg:hidden lg:text-center text-sm font-semibold text-gray-light max-w-[15rem]">
                    {" "}
                    {title}
                </p>
            </div>
            {index !== 3 && (
                <div className="lg:hidden w-0.5 absolute left-5 md:left-8 top-8 z-1">
                    <Image src={LineImageVertical} alt="Line" className="h-[100px]" />
                </div>
            )}
            <p className="hidden lg:block lg:text-center font-semibold text-gray-light ml-[-5%] w-full max-w-[15rem]">
                {" "}
                {title}
            </p>
        </div>
    );
};

export default StepsChart;
