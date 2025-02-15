"use client";

import ActionPanel from "@/components/community/ActionPanel";
import FeedCard from "@/components/community/FeedCard";
import FeedViewModal from "@/components/community/FeedViewModal";
import { PostModal } from "@/components/community/Modals";
import CommunityReportModal from "@/components/community/ReportsModal";
import { getCurrentTab } from "@/constants/community";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import NotificationSection from "@/components/community/NotificationSection";
import EditCommunityPost from "@/components/community/EditPost";

export default function CommunityPage() {
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const [mode, setMode] = useQueryState("mode");
    const [_, setId] = useQueryState("id");
    const [activeTab] = useQueryState("tab");
    const title = getCurrentTab(activeTab)?.name;

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportModalPostId, setReportModalPostId] = useState("");

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

    const handleCloseModal = () => {
        setMode(null);
        setId(null);
    };

    const handleFeedCardClick = (id: string) => {
        setId(id);
        setMode("view");
    };

    const handleReportClick = (post_id: string) => {
        setReportModalOpen(true);
        setReportModalPostId(post_id);
    };

    const handleCloseReportModal = () => {
        setReportModalOpen(false);
        setReportModalPostId("");
    };
    
    return (
        <div className="grid grid-cols-12 h-[90dvh] overflow-hidden animate-fadeIn">
            <CommunityReportModal
                postId={reportModalPostId}
                isOpen={reportModalOpen}
                onClose={handleCloseReportModal}
            />

            <PostModal isOpen={mode === "add"} onClose={handleCloseModal} />
            <EditCommunityPost isOpen={mode === "edit"} onClose={handleCloseModal} />

            <FeedViewModal
                isOpen={mode === "view"}
                onClose={handleCloseModal}
                isManagePost={activeTab === "manage_your_posts"}
                handleReportClick={handleReportClick}
            />
            <div className="col-span-12 flex flex-col min-h-0 flex-grow">
                <div className="lg:hidden w-full border-b sticky top-0 z-10 px-4 py-5 bg-[#F4F7FB]">
                    <div className="w-full overflow-x-auto no-scrollbar">
                        <ActionPanel />
                    </div>
                </div>

                <div className="flex md:flex-row justify-between gap-4 md:p-6 md:pb-0 flex-1 min-h-0 overflow-auto">
                    {/* Main Content Area */}
                    <div className="flex-1 md:w-8/12 p-0 md:p-0 overflow-auto no-scrollbar md:rounded-3xl flex flex-col">
                        <div className="flex-1 bg-white md:rounded-3xl md:p-6 pb-2 md:mb-6">
                            {activeTab === "your_notifications" ? (
                                <NotificationSection />
                            ) : (
                                <div className="flex flex-col min-h-0 flex-grow h-full">
                                    <FeedCard
                                        onClick={handleFeedCardClick}
                                        handleReportClick={handleReportClick}
                                        isManagePost={activeTab === "manage_your_posts"}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Action Panel */}
                    <div className="hidden lg:block min-h-0">
                        <div className="bg-white rounded-2xl p-4 min-w-[380px] min-h-[390px]">
                            <div className="h-full overflow-auto no-scrollbar">
                                <ActionPanel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
