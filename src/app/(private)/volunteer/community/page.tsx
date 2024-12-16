"use client";

import ActionPanel from "@/components/community/ActionPanel";
import FeedCard from "@/components/community/FeedCard";
import FeedViewModal from "@/components/community/FeedViewModal";
import { PostModal } from "@/components/community/Modals";
import NotificationCard from "@/components/community/NotificationCard";
import { getCurrentTab } from "@/constants/community";
import { getHeaderIcon } from "@/layouts/helper";
import { useAppStore } from "@/store/useAppStore";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export default function CommunityPage () {
    const { setHeaderOptions } = useAppStore();
    const pathname = usePathname();
    const [mode, setMode] = useQueryState("mode");
    const [_, setId] = useQueryState("id");
    const [activeTab] = useQueryState("tab");
    const title = getCurrentTab(activeTab)?.name;

    const handleAddNewPost = () => {
        setMode("add");
    };

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Search",
            actionButtonTitle: "Add new post",
            actionButtonOnClick: handleAddNewPost,
            actionButtonClassName:
                "!bg-background-secondary hover:!border-none !text-black !rounded-xl hover:!bg-background-secondary hover:!text-black !h-[35px] !text-xs !py-2 px-4",
            actionButtonPlacement: "right",
            showButton: true,
            title: "Community",
            titleIcon: getHeaderIcon(pathname),
        });
    }, [pathname, setHeaderOptions]);

    const posts: any = [
        {
            id: "1",
            title: "Post 1",
            description: "Description 1",
            image: "https://via.placeholder.com/150",
        },
    ];

    const handleCloseModal = () => {
        setMode(null);
        setId(null);
    };

    const handleFeedCardClick = (id: string) => {
        setId(id);
        setMode("view");
    };

    return (
        <div className='grid grid-cols-12 p-6 w-full h-full overflow-hidden'>
            <PostModal isOpen={mode === "add"} onClose={handleCloseModal} />
            <FeedViewModal isOpen={mode === "view"} onClose={handleCloseModal} />
            <div className='col-span-12 flex justify-between gap-4 overflow-hidden h-full w-full'>
                <div className='col-span-8 w-full bg-white rounded-3xl mb-6 h-full overflow-auto no-scrollbar p-6 flex flex-col gap-4'>
                    <h2>{title}</h2>
                    {posts.map((post: any, index: number) =>
                        activeTab === "your_notifications" ? (
                            <NotificationCard />
                        ) : (
                            <FeedCard key={index} onClick={() => handleFeedCardClick(post.id)} />
                        )
                    )}
                </div>
                <div className='col-span-3'>
                    <ActionPanel />
                </div>
            </div>
        </div>
    );
}
