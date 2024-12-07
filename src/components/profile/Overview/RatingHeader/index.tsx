import React from "react";
import { IoStarSharp } from "react-icons/io5";
const RatingHeader = () => {
    return (
        <div className="flex items-center justify-between w-full gap-4 bg-[#f4f7fb] rounded-full px-5 py-6">
            <p className="font-semibold">Rating</p>
            <div className="flex items-center gap-2">
                <p className="text-[1.5rem] font-semibold">4.5</p>
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <span className="-ml-0.5">
                            <IoStarSharp key={index} className="text-[1.6rem] text-[#FFD700]" />
                        </span>
                    ))}
                </div>
                <p className="text-sm font-medium">(120)</p>
            </div>
        </div>
    );
};

export default RatingHeader;
