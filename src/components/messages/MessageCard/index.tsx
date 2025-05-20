"use client";
import Image from "next/image";
import React from "react";

const MessageCard = ({ name, message, time, date, image, unreadMessages }: MessageCardProps) => {
    return (
        <div className="flex items-center gap-4 border-b border-gray-200 p-4 hover:bg-[#f4f7fb] cursor-pointer transition-all duration-300">
            <div className="relative w-11 h-11 rounded-full overflow-hidden">
                <Image
                    src="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    alt="message"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 justify-between">
                    <p className="text-base font-medium">Alexander Harris</p>
                    <div>
                        {unreadMessages > 0 ? (
                            <p className="text-xs font-normal text-[#22c55e]">7.00 pm</p>
                        ) : (
                            <p className="text-xs text-[#4F4F4F]">16/05/2025</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-normal text-gray-500 truncate w-full overflow-hidden whitespace-nowrap block">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </p>
                    {unreadMessages > 0 && (
                        <span className="text-[10px] w-4 h-4 rounded-full bg-[#22c55e] text-white flex items-center justify-center">
                            {unreadMessages}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageCard;
