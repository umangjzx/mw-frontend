"use client";
import React from "react";

const OverViewCard: React.FC<OverViewCardProps> = ({ title, value, icon }) => {
    const gradient =
        "linear-gradient(to right, #d5e2f6, #d4e4f6, #d4e6f6, #d4e7f5, #d5e9f5, #d5ebf5, #d5ecf5, #d5eef4, #d4f0f4, #d4f2f3, #d5f3f2, #d6f5f0)";

    return (
        <div
            className="flex rounded-xl px-5 py-4 w-full gap-3 items-center"
            style={{ background: gradient }}
        >
            {icon}
            <div className="flex flex-col gap-2 justify-center">
                <p className="text-[1.5rem] font-semibold">{value}</p>
                <p className="font-medium text-xs">{title}</p>
            </div>
        </div>
    );
};

export default OverViewCard;
