"use client";
import React, { useEffect } from "react";
import { useComponentStore } from "@/store/useComponenetStore";
import { getHeaderIcon } from "@/layouts/helper";
import { usePathname } from "next/navigation";
import { Input } from "@/components/common/Input";
import { useQueryState } from "nuqs";
import MessageCard from "@/components/messages/MessageCard";

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

    const handleSearch = (value: string) => {
        setSearchQuery(value);
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
            <div className="max-w-[440px] h-full shrink-0 rounded-tl-[3rem] p-4 border-r border-gray-200">
                <div className="flex items-center justify-between  rounded-tl-[3rem] py-2">
                    <p className="text-2xl font-medium">All Chats</p>
                    <p className="text-base text-gray-500 font-medium">10 Chats</p>
                </div>
                <div className="py-4">
                    <Input
                        value={searchQuery ?? ""}
                        inputType="search"
                        name="search"
                        inputClassName="!bg-transparent !rounded-3xl gap-1 font-medium items-center w-full"
                        className="!bg-transparent w-full !mb-0"
                        onChange={handleSearch}
                        placeholder={"Search"}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    {messages.map((message) => (
                        <MessageCard key={message.name} {...message} />
                    ))}
                </div>
            </div>
            <div className="w-full h-full flex-1"></div>
        </div>
    );
};

export default Messages;
