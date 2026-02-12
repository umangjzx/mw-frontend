import React from "react";
import Image from "next/image";
import moment from "moment";
interface MessageBubbleProps {
    message: string;
    timestamp: string;
    date: string;
    isOwnMessage: boolean;
    userImage?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    timestamp,
    date,
    isOwnMessage,
    userImage,
}) => {
    return (
        <div
            className={`w-full h-fit flex items-${
                isOwnMessage ? "end" : "start"
            } mt-5 flex-col gap-4 `}
        >
            <div className="flex gap-2 transition-all duration-300 ease-in-out">
                {!isOwnMessage && userImage && (
                    <div className="flex items-end gap-2">
                        <div className="relative hidden md:block w-6 h-6 rounded-full overflow-hidden">
                            <Image src={userImage} alt="message" fill className="object-cover" />
                        </div>
                    </div>
                )}
                <div
                    className={`${
                        isOwnMessage ? "md:bg-[#f4f7fb] bg-white" : "bg-white md:border md:border-gray-200"
                    } max-w-[450px] rounded-lg px-2 py-4 transition-all duration-300 ease-in-out hover:shadow-sm`}
                >
                    <p className="md:text-base text-[16px] break-words">{message}</p>
                    <div className="flex justify-end mt-2 items-center gap-1.5 md:gap-2 md:text-sm text-[16px] font-normal text-[#4F4F4F] md:text-gray-500">
                        <span className="md:hidden">{moment.parseZone(date).format("DD MMM, YYYY")}</span>
                        <span className="md:hidden text-[#4F4F4F] font-black">•</span>
                        <span className="md:hidden">{moment.parseZone(date).format("h.mm a")}</span>
                        <span className="hidden md:inline">{moment.parseZone(date).format("DD MMM, YYYY h.mm a")}</span>
                    </div>
                </div>
                {isOwnMessage && userImage && (
                    <div className="flex items-end gap-2">
                        <div className="relative hidden md:block w-6 h-6 rounded-full overflow-hidden">
                            <Image src={userImage} alt="message" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
