"use client";

import { getMyResources, getResources } from "@/api/resources";
import AddResourceCard from "@/components/resources/AddResourceCard";
import Card from "@/components/resources/Card";
import DetailModal from "@/components/resources/DetailModal";
import { ResourceModal } from "@/components/resources/Modals";
import ResourceReportModal from "@/components/resources/ReportsModal";
import SectionWrapper from "@/components/resources/SectionWrapper";
import TopicCard from "@/components/resources/TopicCard";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useWindowSize } from "@/hooks/useWindowSize";

//TODO: Needs to be deleted
const TopicData = [
    {
        title: "Basic",
    },
    {
        title: "skills",
    },
];

const TabData = [
    { id: "topics", label: "Topics" },
    { id: "suggested", label: "Suggested for you" },
    { id: "trending", label: "Trending" },
];

export default function ResourcesPage() {
    const { setHeaderOptions } = useComponentStore();
    const [category, setCategory] = useQueryState("category");
    const [_, setId] = useQueryState("id");
    const [mode, setMode] = useQueryState("mode");
    const [searchQuery] = useQueryState("query");

    const pathname = usePathname();
    const [resources, setResources] = useState([]);

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportModalResourceId, setReportModalResourceId] = useState("");

    const { data: MyResources, refetch } = useQuery({
        queryKey: ["my-resource"],
        queryFn: getMyResources,
    });
    const triggerReload = async () => await refetch();

    const { isFetching } = useQuery({
        queryKey: ["resources", searchQuery],
        queryFn: async () => {
            setResources([]);
            const resources = await getResources({ query: searchQuery || "" });
            setResources(resources?.items);
            return resources;
        },
    });

    const handleTopicClick = (title: string) => {
        setCategory(title);
    };

    const handleMyResourcesClick = () => {
        setCategory("my-resources");
    };

    const handleBackClick = () => {
        setCategory(null);
    };

    // * Used to set topbar options
    useEffect(() => {
        const headerTitle = category || "Resources";
        const titleIcon =
            category !== null ? <IoIosArrowBack className="text-lg" /> : getHeaderIcon(pathname);

        //* Used zustand to update the props of common header component
        setHeaderOptions({
            searchPlaceholder: "Search resources",
            actionButtonTitle: "My Resources",
            actionButtonOnClick: handleMyResourcesClick,
            actionButtonClassName:
                "!bg-black !text-white !rounded-xl hover:!bg-black hover:!text-white !h-[35px] !text-xs !py-2 px-4",
            actionButtonPlacement: "left",
            showButton: category === null,
            title: headerTitle,
            titleIcon,
            titleIconClick: category !== null ? handleBackClick : undefined,
        });
    }, [category, pathname, setHeaderOptions]);

    const handleAddResourceClick = () => {
        setMode("create");
    };

    const handleCloseModal = () => {
        setMode(null);
        setId(null);
    };

    const handleViewOrEditResource = (mode: ShowModalType, id: string) => {
        setMode(mode);
        setId(id);
    };

    const handleUserLikeAction = (resource_id: string, likeStatus: boolean) => {
        setResources((prevResources: any) =>
            prevResources?.map((resource: any) => {
                if (resource?.resource_id === resource_id) {
                    return {
                        ...resource,
                        total_likes: resource?.total_likes + (likeStatus ? +1 : -1),
                    };
                }
                return resource;
            })
        );
    };

    const handleReportClick = (resource_id: string) => {
        setReportModalOpen(true);
        setReportModalResourceId(resource_id);
    };

    const handleCloseReportModal = () => {
        setReportModalOpen(false);
        setReportModalResourceId("");
    };

    const [activeTab, setActiveTab] = useState("topics");
    const { width } = useWindowSize();
    const isMobile = width < 768; // Define mobile breakpoint

    return (
        <div className="w-full  pt-8 flex flex-col gap-2 p-4 animate-fadeIn">
            {/* Resource Modal */}
            <ResourceModal
                triggerReload={triggerReload}
                isOpen={mode !== null && mode !== "view"}
                mode={mode as ShowModalType}
                onClose={handleCloseModal}
            />

            <ResourceReportModal
                resourceId={reportModalResourceId}
                isOpen={reportModalOpen}
                onClose={handleCloseReportModal}
            />

            {/* Detail Modal */}
            <DetailModal
                handleUserLikeAction={handleUserLikeAction}
                triggerReload={triggerReload}
                isOpen={mode === "view"}
                onClose={handleCloseModal}
                handleReportClick={handleReportClick}
            />

            {/* Mobile Tabs - Only show on mobile */}
            {isMobile && !category && (
                <div className="overflow-x-auto flex gap-2 pb-4 hide-scrollbar md:hidden">
                    {TabData.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                                activeTab === tab.id
                                    ? "bg-[#DFF5FF] text-black border border-[#09BAEE] text-[14px] font-[500]"
                                    : "bg-[#F4F7FB] border border-[#E0E0E0] text-[14px] font-[500] text-black"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Desktop and Mobile Topics View */}
            {(!isMobile || (isMobile && activeTab === "topics")) && !category && (
                <SectionWrapper
                    hideSectionHeader={category !== null}
                    data={TopicData}
                    title={!isMobile ? "Topics" : undefined}
                    renderItem={(item, index) => (
                        <TopicCard
                            onClick={() => handleTopicClick(item.title)}
                            index={index}
                            item={item}
                        />
                    )}
                />
            )}

            {/* Resources Section */}
            {(!isMobile || (isMobile && activeTab === "suggested")) &&
                !category &&
                category !== "my-resources" && (
                    <SectionWrapper
                        placeHolderComponent={undefined}
                        onPlaceHolderClick={handleAddResourceClick}
                        data={resources || []}
                        isLoading={isFetching}
                        title={!isMobile && category === null ? "Resources" : undefined}
                        renderItem={(item, index) => (
                            <>
                                <Card
                                    className="w-full"
                                    key={item?.resource_id || index}
                                    resource={item}
                                    onClick={() =>
                                        handleViewOrEditResource("view", item?.resource_id)
                                    }
                                    handleReportClick={handleReportClick}
                                />
                            </>
                        )}
                    />
                )}

            {/* My Resources section */}
            {category === "my-resources" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6">
                    <div className="w-full col-span-1">
                        <AddResourceCard handleClick={handleAddResourceClick} />
                    </div>
                    {MyResources?.items?.map((resource: any, index: number) => (
                        <div key={resource?.resource_id || index} className="col-span-1">
                            <Card
                                resource={resource}
                                className="w-full h-full"
                                onClick={() =>
                                    handleViewOrEditResource("view", resource?.resource_id)
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Trending section - Mobile only */}
            {isMobile && activeTab === "trending" && (
                <div className="animate-fadeIn">{/* Add your trending content here */}</div>
            )}
        </div>
    );
}
