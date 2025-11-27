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
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image src={userImage} alt="message" fill className="object-cover" />
                        </div>
                    </div>
                )}
                <div
                    className={`${
                        isOwnMessage ? "bg-[#f4f7fb]" : "bg-white border border-gray-200"
                    } max-w-[450px] rounded-lg px-2 py-4 transition-all duration-300 ease-in-out hover:shadow-sm`}
                >
                    <p className="break-words">{message}</p>
                    <div className="flex justify-end mt-2 items-center gap-2 font-normal text-gray-500">
                        <span>{moment.parseZone(date).format("DD MMM, YYYY h.mm a")}</span>
                        
                    </div>
                </div>
                {isOwnMessage && userImage && (
                    <div className="flex items-end gap-2">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image src={userImage} alt="message" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
