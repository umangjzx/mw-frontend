"use client";
import { CommunityTabs } from "@/constants/community";
import { useQueryState } from "nuqs";
const ActionPanel = () => {
    const [activeTab, setActiveTab] = useQueryState("tab");

    const handleTabClick = (tab: string | null) => {
        setActiveTab(tab);
    };

    return (
        <div className='flex flex-col gap-4 min-w-[380px] bg-white rounded-xl p-5 h-fit'>
            <p className='text-xl font-medium'>Action Panel</p>
            <div className='flex flex-col gap-3'>
                {CommunityTabs.map(tab => (
                    <div
                        key={tab.route}
                        className={`flex items-center gap-2  rounded-full px-4 p-3  border-[1px] transition-all cursor-pointer duration-300 ease-in-out hover:bg-background ${
                            activeTab === tab.route
                                ? "bg-background border-primary"
                                : "bg-[#f4f7fb] border-stroke"
                        }`}
                        onClick={() => handleTabClick(tab.route)}
                    >
                        <p className='text-sm font-medium'>{tab.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionPanel;
