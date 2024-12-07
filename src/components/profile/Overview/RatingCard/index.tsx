"use client";
import Divider from "@/components/common/Divider";
import Image from "next/image";
import React from "react";
import { IoStarSharp } from "react-icons/io5";

const RatingCard: React.FC<RatingCardProps> = ({ profileImg, name, rating, day, review }) => {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-1 w-[800px]">
                <div className="w-[40px] h-[40px] relative flex-shrink-0">
                    <Image
                        src={profileImg}
                        alt="profile picture"
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="ml-1 flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2 w-full">
                        <p className="font-semibold text-black text-sm">{name}</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        <div className="flex items-center gap-1">
                            <p className="font-semibold text-black text-sm">{rating}</p>
                            <IoStarSharp className="text-[1rem] text-[#FFD700]" />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        <p className="font-semibold text-black text-sm">{day}</p>
                    </div>
                    <p className="text-sm font-normal text-gray-light">{review}</p>
                </div>
            </div>
            <Divider />
        </div>
    );
};

export default RatingCard;
