"use client";
import React from "react";
import Image from "next/image";
import LineImage from "@/assets/images/LineImg.png";
import LineImageVertical from "@/assets/images/LineImgVertical.png";

interface StepsChartProps {
    title: string;
    icon: React.ReactNode;
    index: number;
}

const StepsChart = ({ title, icon, index }: StepsChartProps) => {
    return (
        <div
            key={index}
            className="flex flex-col lg:items-center relative gap-4 w-full lg:w-[17rem] h-[100px] lg:h-[170px]"
        >
            <div className="flex flex-row items-center w-full lg:ml-[70%]">
                <div className="rounded-full z-10 md:mr-3 lg:mr-0">{icon}</div>
                {index !== 3 && (
                    <div className="relative hidden lg:block w-full h-0.5">
                        <Image src={LineImage} alt="Line" className="w-full" fill />
                    </div>
                )}
                <p className="lg:hidden text-center text-sm font-semibold text-gray-light w-[15rem]">
                    {" "}
                    {title}
                </p>
            </div>
            {index !== 3 && (
                <div className="lg:hidden w-0.5 absolute md:left-8 left-5 top-8 z-1">
                    <Image src={LineImageVertical} alt="Line" className="h-[100px]" />
                </div>
            )}
            <p className="hidden lg:block text-center font-semibold text-gray-light ml-[-5%] w-[15rem]">
                {" "}
                {title}
            </p>
        </div>
    );
};

export default StepsChart;
