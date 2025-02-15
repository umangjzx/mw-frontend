"use client";

import { getMyResources, getResources, getResourcesByCategory } from "@/api/resources";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useWindowSize } from "@/hooks/useWindowSize";

import { useComponentStore } from "@/store/useComponenetStore";
import { getHeaderIcon } from "@/layouts/helper";

import AddResourceCard from "@/components/resources/AddResourceCard";
import Card from "@/components/resources/Card";
import DetailModal from "@/components/resources/DetailModal";
import { ResourceModal } from "@/components/resources/Modals";
import ResourceReportModal from "@/components/resources/ReportsModal";
import SectionWrapper from "@/components/resources/SectionWrapper";
import TopicCard from "@/components/resources/TopicCard";
import CategorySection from "@/components/resources/CategorySection";

const TabData = [
    { id: "topics", label: "Topics" },
    { id: "suggested", label: "Suggested for you" },
];

export default function ResourcesPage() {
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const [category, setCategory] = useQueryState("category");
    const [_, setId] = useQueryState("id");
    const [mode, setMode] = useQueryState("mode");
    const [searchQuery] = useQueryState("query");
    const [activeTab, setActiveTab] = useState("topics");
    const [resources, setResources] = useState([]);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportModalResourceId, setReportModalResourceId] = useState("");

    // Queries
    const { data: MyResources, refetch } = useQuery({
        queryKey: ["my-resource"],
        queryFn: getMyResources,
    });

    const { isFetching } = useQuery({
        queryKey: ["resources", searchQuery, category],
        queryFn: async () => {
            setResources([]);
            const allResources = await getResources({ query: searchQuery || "" });
            setResources(allResources?.items);
            return allResources;
        },
    });

    const { data: ResourceCategories, isFetching: isFetchingCategories } = useQuery({
        queryKey: ["resource-categories"],
        queryFn: async () => {
            const categories = await GET_API(endpoints.resources.getCategories);
            return categories?.data;
        },
    });

    const topicSingleTitle = useMemo(() => {
        return ResourceCategories?.find((topic: any) => topic?.category_id === category)?.category_name;
    }, [category, ResourceCategories]);

    // Handlers
    const handleTopicClick = (title: string) => setCategory(title);
    const handleMyResourcesClick = () => setCategory("my-resources");
    const handleBackClick = () => setCategory(null);
    const handleAddResourceClick = () => setMode("create");
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
            prevResources?.map((resource: any) =>
                resource?.resource_id === resource_id
                    ? {
                          ...resource,
                          total_likes: resource?.total_likes + (likeStatus ? 1 : -1),
                      }
                    : resource
            )
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

    // Header setup
    useEffect(() => {
        const categoryTitle = ResourceCategories?.find((topic: any) => topic?.category_id === category)?.category_name;
        const headerTitle = (category && categoryTitle) || "Resources";
        const titleIcon = category !== null ? <IoIosArrowBack className="text-lg" /> : getHeaderIcon(pathname);

        setHeaderOptions({
            searchPlaceholder: "Search resources",
            actionButtonTitle: "My Resources",
            actionButtonOnClick: handleMyResourcesClick,
            actionButtonClassName: "!bg-black !text-white !rounded-xl hover:!bg-black hover:!text-white !h-[35px] !text-xs !py-2 px-4",
            actionButtonPlacement: "left",
            showButton: category === null,
            showTitleButton: !!category,
            title: headerTitle,
            titleIcon,
            titleIconClick: category !== null ? handleBackClick : undefined,
        });
    }, [category, pathname, setHeaderOptions, ResourceCategories]);

    return (
        <div className="w-full pt-4 lg:pt-8 flex flex-col gap-2 p-4 animate-fadeIn">
            <ResourceModal
                triggerReload={refetch}
                isOpen={mode !== null && mode !== "view"}
                mode={mode as ShowModalType}
                onClose={handleCloseModal}
            />

            <ResourceReportModal
                resourceId={reportModalResourceId}
                isOpen={reportModalOpen}
                onClose={handleCloseReportModal}
            />

            <DetailModal
                handleUserLikeAction={handleUserLikeAction}
                triggerReload={refetch}
                isOpen={mode === "view"}
                onClose={handleCloseModal}
                handleReportClick={handleReportClick}
            />

            {category && topicSingleTitle && (
                <CategorySection
                    topicSingleTitle={topicSingleTitle}
                    handleViewOrEditResource={handleViewOrEditResource}
                />
            )}

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

            {!isFetchingCategories && ResourceCategories?.length > 0 && (!isMobile || (isMobile && activeTab === "topics")) && !category && (
                <SectionWrapper
                    hideSectionHeader={category !== null}
                    data={ResourceCategories}
                    title={!isMobile ? "Topics" : undefined}
                    renderItem={(item, index) => (
                        <TopicCard
                            onClick={() => handleTopicClick(item?.category_id)}
                            index={index}
                            item={item}
                        />
                    )}
                />
            )}

            {(!isMobile || (isMobile && activeTab === "suggested")) && !category && (
                <SectionWrapper
                    placeHolderComponent={undefined}
                    onPlaceHolderClick={handleAddResourceClick}
                    data={resources || []}
                    isLoading={isFetching}
                    title={!isMobile && category === null ? "Resources" : undefined}
                    renderItem={(item, index) => (
                        <div className="lg:w-[250px]">
                            <Card
                                className="w-full"
                                imgClassName=""
                                key={item?.resource_id || index}
                                resource={item}
                                onClick={() => handleViewOrEditResource("view", item?.resource_id)}
                                handleReportClick={handleReportClick}
                            />
                        </div>
                    )}
                />
            )}

            {category === "my-resources" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6">
                    <div className="w-full col-span-1">
                        <AddResourceCard handleClick={handleAddResourceClick} />
                    </div>
                    {MyResources?.items?.map((resource: any, index: number) => (
                        <div key={resource?.resource_id || index} className="col-span-1">
                            <Card
                                resource={resource}
                                className="!w-full !h-full"
                                onClick={() => handleViewOrEditResource("view", resource?.resource_id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}