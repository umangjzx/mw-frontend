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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_API, POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";
import { Spin } from "antd";
import VolunteerChatList from "@/components/messages/VolunteerChatList";
import NoMessage from "@/components/messages/NoMessage";
import LottieLoader from "@/components/common/Loader/Lottie";

const ChatHeaderSkeleton = () => {
    return (
        <div className="flex items-center gap-4 border-b border-gray-200 p-4 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-gray-200" />
            <div className="min-w-0 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 justify-between">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-48" />
                </div>
            </div>
        </div>
    );
};

interface ChatMessage {
    message_id: string;
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

const Messages = () => {
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const [message, setMessage] = useState("");
    const volunteerId = Cookies.get("volunteer_id");
    const [chats, setChats] = useState([]);
    const chatId = useSearchParams().get("chatId");
    const learnerId = useSearchParams().get("learnerId");
    const [individualChat, setIndividualChat] = useState<ChatMessage[]>([]);
    const [recieverName, setRecieverName] = useState("");
    const [recieverImage, setRecieverImage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatPermission, setChatPermission] = useState(true);
    const [isIndividualLoading, setIsIndividualLoading] = useState(false);
    const queryClient = useQueryClient();
    const [messageId, setMessageId] = useState([]);
    const [noChats, setNoChats] = useState<boolean | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [individualChat]);

    const getAllChatsForLearners = () => {
        setIsLoading(true);
        GET_API(endpoints.chat.getAllchatsOfVolunteer(volunteerId as string))
            .then((res: any) => {
                setChats(res.data);

                if (res.data.length === 0) {
                    setNoChats(true);
                } else {
                    setNoChats(false);
                }
                // Find matching chat and update receiver details
                if (chatId) {
                    const matchingChat = res.data.find((chat: any) => chat.chat_id === chatId);
                    if (matchingChat) {
                        setRecieverName(matchingChat.learner_name);
                        setRecieverImage(matchingChat.learner_profile_picture.image_url);
                        setChatPermission(matchingChat.chat_permission);
                    }
                }

                if (!chatId && !learnerId && res.data.length > 0) {
                    const firstChat = res.data[0];
                    router.push(
                        `/volunteer/messages?chatId=${firstChat.chat_id}&learnerId=${firstChat.learner_id}`
                    );
                }
            })
            .catch((err: any) => {
                console.log(err);
                setNoChats(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getIndividualChat = async () => {
        setIsIndividualLoading(true);
        const response = await GET_API(endpoints.chat.getIndividualChat(chatId as string));
        if (response.data[0].receiver_id === volunteerId) {
            setRecieverName(response.data[0].sender_name);
            setRecieverImage(response.data[0].sender_profile_picture.image_url);
        } else {
            setRecieverName(response.data[0].receiver_name);
            setRecieverImage(response.data[0].receiver_profile_picture.image_url);
        }
        // Only store message IDs for unread messages
        const unreadMessageIds = response.data
            .filter((msg: ChatMessage) => !msg.read)
            .map((msg: ChatMessage) => msg.message_id);

        setMessageId(unreadMessageIds);
        setIndividualChat(response.data);
        setIsIndividualLoading(false);
        return response.data;
    };

    const {
        data,
        isLoading: isLoadingChats,
        isError: isErrorChats,
    } = useQuery({
        queryKey: ["chats"],
        queryFn: () => getAllChatsForLearners(),
        // refetchInterval: 1000,
    });

    const { data: individualChatData, refetch: refetchIndividualChat } = useQuery({
        queryKey: ["individualChat", chatId],
        queryFn: () => getIndividualChat(),
        enabled: !!chatId,
        // refetchInterval: 1000,
    });

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
        POST_API(endpoints.chat.sendMessageToLearner(learnerId as string), payload).then(
            (res: any) => {
                setMessage("");
                refetchIndividualChat();
            }
        );
    };

    const postReadMessage = async () => {
        const response = await POST_API(endpoints.chat.readMessage, {
            message_ids: messageId,
        }).then((res: any) => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        });
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
    }, [chatId, learnerId]);

    useEffect(() => {
        if (messageId.length > 0) {
            postReadMessage();
        }
    }, [messageId]);

    if (noChats === null) {
        return <LottieLoader isLoading={true} />;
    }

    return (
        <>
            {noChats ? (
                <NoMessage />
            ) : (
                <div className="w-full h-full bg-white flex border border-gray-200 rounded-tl-[3rem] animate-fadeIn">
                    <VolunteerChatList
                        messages={chats}
                        searchQuery={searchQuery}
                        onSearch={handleSearch}
                    />
                    <div className="w-full h-full flex-1">
                        {isIndividualLoading ? (
                            <ChatHeaderSkeleton />
                        ) : (
                            <ChatHeader
                                name={recieverName}
                                location="Orlando, Florida"
                                image={recieverImage}
                            />
                        )}
                        <div className="flex flex-col gap-4 p-4 h-[calc(100vh-16em)] overflow-y-auto">
                            {isIndividualLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spin size="large" />
                                </div>
                            ) : (
                                individualChat?.map((message: any, index: any) => {
                                    return (
                                        <MessageBubble
                                            key={message.chat_id}
                                            message={message.message}
                                            timestamp={new Date(
                                                message.created_at
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            date={new Date(message.created_at).toLocaleDateString()}
                                            isOwnMessage={message.sender_id === volunteerId}
                                            userImage={
                                                message.sender_id === volunteerId
                                                    ? message.sender_profile_picture.image_url
                                                    : message.receiver_profile_picture.image_url
                                            }
                                        />
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 flex items-center gap-8 transition-all duration-300">
                            {chatPermission ? (
                                <>
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
                                        disabled={!message.trim() || !chatPermission}
                                        onClick={handleSendMessage}
                                        title="Send Message"
                                        btnVariant="secondary"
                                        className="!rounded-xl !text-sm !bg-black hover:!bg-black !text-white transition-all duration-300"
                                    />
                                </>
                            ) : (
                                <p className="text-gray-600 text-sm text-center w-full font-medium">
                                    {recieverName} has disabled chat for this conversation
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Messages;
