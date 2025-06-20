import React from "react";
import Image from "next/image";

interface ChatHeaderProps {
    name: string;
    location: string;
    image: string;
    onSeeMoreClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, location, image, onSeeMoreClick }) => {
    return (
        <div className="flex items-center gap-4  p-4 hover:bg-[#f4f7fb] cursor-pointer transition-all duration-300 w-full animate-fadeIn">
            <div
                onClick={onSeeMoreClick}
                className="relative w-11 h-11 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
            >
                <Image src={image} alt="message" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 justify-between">
                    <p className="text-base font-medium transition-colors duration-300">{name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-normal text-gray-500 transition-colors duration-300">
                        From <span className="text-black font-medium capitalize">{location}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
