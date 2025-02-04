import React from "react";
import NotificationProfileImg from "@/assets/images/NotificationProfileImg.png";
import PostImg from "@/assets/images/PostImg.png";
import Image from "next/image";

const NotificationCard = () => {
    return (
        <div className="flex gap-2 sm:gap-3 items-start sm:items-center justify-between p-2 pt-4">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
                <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] relative flex-shrink-0">
                    <Image src={NotificationProfileImg} alt="NotificationProfileImg" fill />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="text-gray-light font-medium text-sm sm:text-base">
                        <span className="font-semibold text-black">
                            Vinoth Kumar, John Doe, Peter Johnson
                        </span>{" "}
                        liked your post
                        <span className="sm:hidden"> • 1d</span>
                    </p>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-light hidden sm:block"></div>
                    <p className="text-gray-light font-medium text-sm sm:text-base hidden sm:block">
                        1d
                    </p>
                </div>
            </div>
            <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] relative flex-shrink-0">
                <Image src={PostImg} alt="PostImg" fill />
            </div>
        </div>
    );
};

export default NotificationCard;
