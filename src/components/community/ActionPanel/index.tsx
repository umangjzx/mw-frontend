"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const ActionPanel = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all_posts");

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        router.push(`/community?tab=${tab}`);
    };

    const tabs = [
        {
            name: "All Posts",
            route: "all_posts",
        },
        {
            name: "Suggested For You",
            route: "suggested_for_you",
        },
        {
            name: "Your Notifications",
            route: "your_notifications",
        },
        {
            name: "Saved Posts",
            route: "saved_posts",
        },
        {
            name: "Manage Your Posts",
            route: "manage_your_posts",
        },
    ];

    return (
        <div className="flex flex-col gap-4 min-w-[380px] bg-white rounded-xl p-5 h-fit">
            <p className="text-xl font-medium">Action Panel</p>
            <div className="flex flex-col gap-3">
                {tabs.map((tab) => (
                    <div
                        key={tab.route}
                        className={`flex items-center gap-2  rounded-full px-4 p-3  border-[1px] transition-all cursor-pointer duration-300 ease-in-out hover:bg-background ${
                            activeTab === tab.route
                                ? "bg-background border-primary"
                                : "bg-[#f4f7fb] border-stroke"
                        }`}
                        onClick={() => handleTabClick(tab.route)}
                    >
                        <p className="text-sm font-medium">{tab.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionPanel;
