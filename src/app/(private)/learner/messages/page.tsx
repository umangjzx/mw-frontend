"use client";
import React, { useEffect, useState, useRef } from "react";
import { useComponentStore } from "@/store/useComponenetStore";
import { getHeaderIcon } from "@/layouts/helper";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import ChatList from "@/components/messages/ChatList";
import ChatHeader from "@/components/messages/ChatHeader";
import MessageBubble from "@/components/messages/MessageBubble";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useQuery } from "@tanstack/react-query";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";
import LottieLoader from "@/components/common/Loader/Lottie";

interface ChatMessage {
    chat_id: string;
    created_at: string;
    created_by: string;
    message: string;
    read: boolean;
    receiver_id: string;
    receiver_name: string;
    receiver_profile_picture: {
        image_url: string;
        image_id: string;
    };
    sender_id: string;
    sender_name: string;
    sender_profile_picture: {
        image_url: string;
        image_id: string;
    };
}

const messages = [
    {
        name: "John Doe",
        message: "Hey, how are you doing?",
        time: "7:00 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 2,
    },
    {
        name: "Jane Smith",
        message: "Can we schedule a meeting tomorrow?",
        time: "6:30 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 0,
    },
    {
        name: "Mike Johnson",
        message: "Thanks for your help with the project!",
        time: "5:45 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 1,
    },
    {
        name: "Sarah Wilson",
        message: "The event was a great success!",
        time: "4:20 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 0,
    },
    {
        name: "David Brown",
        message: "Let's discuss the upcoming workshop",
        time: "3:15 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 3,
    },
    {
        name: "Emily Davis",
        message: "I've sent you the updated documents",
        time: "2:00 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 0,
    },
    {
        name: "Robert Taylor",
        message: "Looking forward to our collaboration",
        time: "1:30 PM",
        date: "16/05/2024",
        image: "http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg",
        unreadMessages: 0,
    },
];

const Messages = () => {
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const [message, setMessage] = useState("");
    const learnerId = Cookies.get("learner_id");
    const [chats, setChats] = useState([]);
    const chatId = useSearchParams().get("chatId");
    const volunteerId = useSearchParams().get("volunteerId");
    const [individualChat, setIndividualChat] = useState<ChatMessage[]>([]);
    const [recieverName, setRecieverName] = useState("");
    const [recieverImage, setRecieverImage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    console.log(chats, "chats data");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [individualChat]);

    const getAllChatsForLearners = () => {
        setIsLoading(true);
        GET_API(endpoints.chat.getAllchatsOfLearner(learnerId as string))
            .then((res: any) => {
                setChats(res.data);
                if (!chatId && !volunteerId && res.data.length > 0) {
                    const firstChat = res.data[0];
                    router.push(
                        `/learner/messages?chatId=${firstChat.chat_id}&volunteerId=${firstChat.volunteer_id}`
                    );
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const {
        data,
        isLoading: isLoadingChats,
        isError: isErrorChats,
    } = useQuery({
        queryKey: ["chats"],
        queryFn: () => getAllChatsForLearners(),
    });

    const getIndividualChat = async () => {
        const response = await GET_API(endpoints.chat.getIndividualChat(chatId as string));
        setRecieverName(response.data[0].receiver_name);
        setRecieverImage(response.data[0].receiver_profile_picture.image_url);
        setIndividualChat(response.data);
        return response.data;
    };

    const { data: individualChatData, refetch: refetchIndividualChat } = useQuery({
        queryKey: ["individualChat", chatId],
        queryFn: () => getIndividualChat(),
        enabled: !!chatId,
    });

    console.log(individualChatData, "individualChatData");

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleMessageChange = (value: string | string[]) => {
        setMessage(Array.isArray(value) ? value[0] : value);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        let payload = {
            message: message,
            chat_id: chatId as string,
        };
        POST_API(endpoints.chat.sendMessageToVolunteer(volunteerId as string), payload).then(
            (res: any) => {
                setMessage("");
                refetchIndividualChat();
            }
        );
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Messages",
            titleIcon: getHeaderIcon(pathname),
            hideSearch: true,
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        setIndividualChat([]);
    }, [chatId, volunteerId]);

    if (isLoadingChats) {
        return <LottieLoader isLoading={true} />;
    }

    return (
        <div className="w-full h-full bg-white flex border border-gray-200 rounded-tl-[3rem] animate-fadeIn">
            <ChatList
                messages={chats}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
            />
            <div className="w-full h-full flex-1">
                <ChatHeader name={recieverName} location="Orlando, Florida" image={recieverImage} />
                <div className="flex flex-col gap-4 p-4 h-[calc(100vh-15.5em)] overflow-y-auto">
                    {individualChat?.map((message: any, index: any) => {
                        return (
                            <MessageBubble
                                key={message.chat_id}
                                message={message.message}
                                timestamp={new Date(message.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                date={new Date(message.created_at).toLocaleDateString()}
                                isOwnMessage={message.sender_id === learnerId}
                                userImage={
                                    message.sender_id === learnerId
                                        ? message.sender_profile_picture.image_url
                                        : message.receiver_profile_picture.image_url
                                }
                            />
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 flex items-center gap-8 transition-all duration-300">
                    <Input
                        value={message}
                        inputType="text"
                        name="message"
                        inputClassName="!bg-[#f4f7fb] !rounded-lg gap-1 font-medium items-center w-full transition-all duration-300"
                        className="!bg-transparent w-full !mb-0"
                        onChange={handleMessageChange}
                        placeholder={"Type message here"}
                    />
                    <Button
                        disabled={!message.trim()}
                        onClick={handleSendMessage}
                        title="Send Message"
                        btnVariant="secondary"
                        className="!rounded-xl !text-sm !bg-black hover:!bg-black !text-white transition-all duration-300"
                    />
                </div>
            </div>
        </div>
    );
};

export default Messages;
