"use client";

import AddResourceCard from "@/components/resources/AddResourceCard";
import Card from "@/components/resources/Card";
import DetailModal from "@/components/resources/DetailModal";
import { ResourceModal } from "@/components/resources/Modals";
import SectionWrapper from "@/components/resources/SectionWrapper";
import TopicCard from "@/components/resources/TopicCard";
import { getHeaderIcon } from "@/layouts/helper";
import { useAppStore } from "@/store/useAppStore";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";


//TODO: Needs to be deleted
const TopicData = [
    {
        title: "Basic",
    },
];

//TODO: Needs to be deleted
const ResourceData = [
    {
        id: "1",
        title: "Resource 1",
    },
];


export default function ResourcesPage () {
    const { setHeaderOptions } = useAppStore();
    const [category, setCategory] = useQueryState("category");
    const [_, setId] = useQueryState("id");
    const [mode, setMode] = useQueryState("mode");

    const pathname = usePathname();

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
            category !== null ? <IoIosArrowBack className='text-lg' /> : getHeaderIcon(pathname);

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

    return (
        <div className='w-full h-full pt-8 flex flex-col gap-2 p-4'>

            {/* Resource Modal */}
            <ResourceModal
                isOpen={mode !== null && mode !== "view"}
                mode={mode as ShowModalType}
                onClose={handleCloseModal}
            />

            {/* Detail Modal */}
            <DetailModal
                isOpen={mode === "view"}
                onClose={handleCloseModal}
            />

            {/* Topics */}
            <SectionWrapper
                hideSectionHeader={category !== null}
                data={TopicData}
                title='Topics'
                renderItem={(item, index) => (
                    <TopicCard
                        onClick={() => handleTopicClick(item.title)}
                        index={index}
                        item={item}
                    />
                )}
            />

            {/* Resources */}
            <SectionWrapper
                placeHolderComponent={category === "my-resources" ? <AddResourceCard /> : undefined}
                onPlaceHolderClick={handleAddResourceClick}
                data={ResourceData}
                title={category !== null ? undefined : "Resources"}
                renderItem={(item, index) => (
                    <Card onClick={() => handleViewOrEditResource("view",item?.id)} />
                )}
            />
        </div>
    );
}
