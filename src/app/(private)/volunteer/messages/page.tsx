"use client";
import React, { useEffect, useState } from "react";
import { useComponentStore } from "@/store/useComponenetStore";
import { getHeaderIcon } from "@/layouts/helper";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import ChatList from "@/components/messages/ChatList";
import ChatHeader from "@/components/messages/ChatHeader";
import MessageBubble from "@/components/messages/MessageBubble";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useQuery } from "@tanstack/react-query";

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
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const [message, setMessage] = useState("");
    console.log(message, "message");

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleMessageChange = (value: string | string[]) => {
        setMessage(Array.isArray(value) ? value[0] : value);
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Messages",
            titleIcon: getHeaderIcon(pathname),
            hideSearch: true,
        });
    }, [setHeaderOptions]);

    return (
        <div className="w-full h-full bg-white flex border border-gray-200 rounded-tl-[3rem]">
            <ChatList messages={messages} searchQuery={searchQuery} onSearch={handleSearch} />
            <div className="w-full h-full flex-1">
                <ChatHeader
                    name="Alexander Harris"
                    location="Orlando, Florida"
                    image="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                />
                <div className="flex flex-col gap-4 p-4 h-[calc(100vh-15.5em)] overflow-y-auto">
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={true}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={false}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={false}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={false}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={true}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={false}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                    <MessageBubble
                        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
                        timestamp="9:54 PM"
                        date="12th Nov"
                        isOwnMessage={true}
                        userImage="http://res.cloudinary.com/dxezkqczp/image/upload/v1747728621/MelodyWings/staging/656cdc7c-3134-45fd-bc17-072b4c83da1a/ccaacab8-8b89-4280-8951-f27bce591aa5/u2pxftkbs9syefnzfzfq.jpg"
                    />
                </div>
                <div className="p-4 flex items-center gap-8">
                    <Input
                        value={message}
                        inputType="text"
                        name="message"
                        inputClassName="!bg-[#f4f7fb] !rounded-lg gap-1 font-medium items-center w-full"
                        className="!bg-transparent w-full !mb-0"
                        onChange={handleMessageChange}
                        placeholder={"Type message here"}
                    />
                    <Button
                        title="Send Message"
                        btnVariant="secondary"
                        className="!rounded-xl !text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default Messages;
