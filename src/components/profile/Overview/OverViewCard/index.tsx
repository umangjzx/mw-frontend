"use client";
import React from "react";
import ClockIcon from "@/assets/icons/ClockIcon";

const OverViewCard: React.FC<OverViewCardProps> = ({ title, value, icon }) => {
    const gradient =
        "linear-gradient(to right, #d5e2f6, #d4e4f6, #d4e6f6, #d4e7f5, #d5e9f5, #d5ebf5, #d5ecf5, #d5eef4, #d4f0f4, #d4f2f3, #d5f3f2, #d6f5f0)";

    return (
        <div
            className=" rounded-xl flex px-5 py-8 w-fit gap-7 items-center"
            style={{ background: gradient }}
        >
            {icon}
            <div className="flex flex-col gap-4 justify-center">
                <p className="text-[2rem] font-semibold">{value}</p>
                <p className="font-medium">{title}</p>
            </div>
        </div>
    );
};

export default OverViewCard;
