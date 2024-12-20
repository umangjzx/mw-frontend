"use client";
import React from "react";
import Image from "next/image";
import LineImage from "@/assets/images/LineImg.png";

interface StepsChartProps {
    title: string;
    icon: React.ReactNode;
    index: number;
}

const StepsChart = ({ title, icon, index }: StepsChartProps) => {
    return (
        <div key={index} className="flex flex-col items-center gap-4 w-[17rem] h-[170px]">
            <div className="flex flex-row items-center w-full ml-[70%]">
                <div className=" rounded-full">{icon}</div>
                {index !== 3 && (
                    <div className="relative w-full h-0.5 ">
                        <Image src={LineImage} alt="Line" className="w-full" fill />
                    </div>
                )}
            </div>
            <p className="text-center font-semibold text-gray-light ml-[-5%] w-[15rem]"> {title}</p>
        </div>
    );
};

export default StepsChart;
