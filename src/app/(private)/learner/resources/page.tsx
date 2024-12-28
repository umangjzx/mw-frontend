"use client";

import { getMyResources, getResources } from "@/api/resources";
import AddResourceCard from "@/components/resources/AddResourceCard";
import Card from "@/components/resources/Card";
import DetailModal from "@/components/resources/DetailModal";
import { ResourceModal } from "@/components/resources/Modals";
import SectionWrapper from "@/components/resources/SectionWrapper";
import TopicCard from "@/components/resources/TopicCard";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

//TODO: Needs to be deleted
const TopicData = [
    {
        title: "Basic",
    },
];

export default function ResourcesPage() {
    const { setHeaderOptions } = useComponentStore();
    const [category, setCategory] = useQueryState("category");
    const [_, setId] = useQueryState("id");
    const [mode, setMode] = useQueryState("mode");
    const [searchQuery] = useQueryState("query");

    const pathname = usePathname();
    const [resources, setResources] = useState([]);

    const { data: MyResources, refetch } = useQuery({
        queryKey: ["my-resource"],
        queryFn: getMyResources,
    })
    const triggerReload = async() => await refetch();

    const { isFetching } = useQuery({
        queryKey: ["resources", searchQuery],
        queryFn: async() => {
            setResources([])
            const resources = await getResources({ query: searchQuery || "" });
            setResources(resources?.items)
            return resources;
        },
    })

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
                        total_likes: resource?.total_likes + (likeStatus ? +1 : -1)
                    };
                }
                return resource;
            })
        );
    }

    return (
        <div className="w-full h-full pt-8 flex flex-col gap-2 p-4 animate-fadeIn">
            {/* Resource Modal */}
            <ResourceModal
                triggerReload={triggerReload}
                isOpen={mode !== null && mode !== "view"}
                mode={mode as ShowModalType}
                onClose={handleCloseModal}
            />

            {/* Detail Modal */}
            <DetailModal handleUserLikeAction={handleUserLikeAction} triggerReload={triggerReload} isOpen={mode === "view"} onClose={handleCloseModal}  />

            {/* Topics */}
            <SectionWrapper
                hideSectionHeader={category !== null}
                data={TopicData}
                title="Topics"
                renderItem={(item, index) => (
                    <TopicCard
                        onClick={() => handleTopicClick(item.title)}
                        index={index}
                        item={item}
                    />
                )}
            />

            {/* Resources */}
            {category !== "my-resources" ?
                <SectionWrapper
                    placeHolderComponent={undefined}
                    onPlaceHolderClick={handleAddResourceClick}
                    data={resources || []}
                    isLoading={isFetching}
                    title={category !== null ? undefined : "Resources"}
                    renderItem={(item, index) => (
                        <Card key={item?.resource_id || index} resource={item} onClick={() => handleViewOrEditResource("view", item?.resource_id)} />
                    )}
                />
                :
                <div className="grid grid-cols-12 p-10 gap-5">
                    <div className="col-span-3">
                        <AddResourceCard handleClick={handleAddResourceClick} />
                    </div>
                    {
                        MyResources?.items?.map((resource: any, index: number) => (
                            <div className="col-span-3">
                                <Card key={resource?.resource_id || index} resource={resource} className="!w-full" onClick={() => handleViewOrEditResource("view", resource?.resource_id)} />
                            </div>
                        ))
                    }
                </div>
            }
        </div >
    );
}
