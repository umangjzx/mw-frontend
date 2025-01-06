"use client";

import { motion } from "framer-motion";
import ModalCloseIcon from "@/assets/icons/ModalCloseIcon";
import ReportIcon from "@/assets/icons/ReportIcon";
import Divider from "@/components/common/Divider";
import TagComponent from "@/components/common/Tag";
import Image from "next/image";
import Link from "next/link";
import ViewModal from "@/components/common/Modals/ViewModal";
import { useQueryState } from "nuqs";
import Button from "@/components/common/Button";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { deleteResource, dislikeResource, getSingleResource, likeResource } from "@/api/resources";
import { showToast } from "@/components/common/Toast";
import { useState } from "react";
import { HeartLikeIcon, UnlikeHeartIcon } from "@/assets/icons";
import LottieLoader from "@/components/common/Loader/Lottie";

type DetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
    handleUserLikeAction: (id: string, status: boolean) => void;
    handleReportClick?: (id: string) => void;
};

const DetailModal = ({ handleUserLikeAction, triggerReload, isOpen, onClose, handleReportClick }: DetailModalProps) => {
    const [category] = useQueryState("category");
    const [resourceId] = useQueryState("id");
    const [mode, setMode] = useQueryState("mode");

    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likedCount, setLikedCount] = useState(0);

    const isMyResource = category === "my-resources";

    const { data: resource, isFetching } = useQuery({
        queryKey: ["resource-single", resourceId],
        queryFn: async () => {
            if (!resourceId) return null;
            const data = await getSingleResource(resourceId);
            setIsLiked(data?.is_liked || false);
            setLikedCount(data?.total_likes || 0);
            return data;
        },
        enabled: Boolean(resourceId),
    });

    const handleLikeDislike = async (status: boolean) => {
        if (!resourceId) return;
        setIsLiked(status);
        setLikedCount((prev) => prev + (status ? 1 : -1));
        handleUserLikeAction(resourceId, status)
        status ? await likeResource(resourceId) : await dislikeResource(resourceId);
    };

    const handleEdit = () => setMode("edit")

    const handleDelete = async () => {
        if (!resourceId) return;
        setIsDeleting(true);
        const res = await deleteResource(resourceId);
        if (res === 200) {
            showToast({ message: "Resource Deleted" });
            triggerReload();
        } else {
            showToast({ message: "Resource not deleted", type: "error" });
        }
        onClose();
        setIsDeleting(false);
    };

    const renderCuratedLinks = () =>
        curatedLinks.map((item, index) => (
            <p key={index}>
                {index + 1}. {item.title} -{" "}
                <Link href={item.link} target="_blank" className="text-primary underline">
                    {item.link}
                </Link>
            </p>
        ));

    const renderSkills = () =>
        resource?.resource_skills?.map((item: any, index: number) => (
            <TagComponent
                key={index}
                text={item?.skill_name}
                className="!py-0 !px-4 !text-[0.75rem] w-fit"
            />
        ));

    const curatedLinks = [
        { title: "Guitar Tuning Guide", link: "https://example.com/guitar-tuning" },
        { title: "Finger Placement Tips", link: "https://example.com/guitar-tuning" },
    ];

    if (!resourceId) return null;

    return (
        <ViewModal modalOpen={isOpen} onClose={onClose} width={800} height="720px">
            {isFetching ? (
                <div className="h-full w-full flex-center">
                    <LottieLoader isLoading={true} />
                </div>
            ) : (
                <>
                    <div className="relative w-full h-[260px] rounded-t-xl">
                        <Image
                            src={resource?.resource_image?.image_url || "/placeholder.png"}
                            fill
                            className="object-cover"
                            alt="Resource"
                        />
                        <div className="flex items-center gap-4 w-fit absolute top-4 right-4">
                            {isMyResource ? (
                                <Button
                                    onClick={handleDelete}
                                    loading={isDeleting}
                                    customClassName="rounded-full !px-4 !gap-1 !text-sm hover:!text-error hover:!bg-error-light !h-[35px] hover:!border-none !border-none"
                                    btnVariant="error"
                                    title="Delete"
                                    icon={<IoTrashOutline size={16} />}
                                />
                            ) : (
                                <div className="h-full px-4 py-2.5 rounded-full bg-[#FEE2E299]/50 flex items-center gap-2 backdrop-blur-[5px]">
                                    {isLiked ? (
                                        <motion.div
                                            key="liked"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            onClick={() => handleLikeDislike(false)}
                                        >
                                            <HeartLikeIcon className="cursor-pointer" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="unliked"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            onClick={() => handleLikeDislike(true)}
                                        >
                                            <UnlikeHeartIcon className="cursor-pointer" />
                                        </motion.div>
                                    )}
                                    <p className="text-sm font-medium text-black">{likedCount}</p>
                                </div>
                            )}
                            <span className="cursor-pointer">
                                {isMyResource ? (
                                    <Button
                                        onClick={handleEdit}
                                        rootClassName="!bg-background-input !px-5 !text-sm !h-[35px]"
                                        size="small"
                                        title="Edit"
                                        icon={<MdEdit size={16} />}
                                    />
                                ) : (
                                    <span onClick={() => handleReportClick?.(resource?.resource_id)}>
                                        <ReportIcon />
                                    </span>
                                )}
                            </span>
                            <span onClick={onClose} className="cursor-pointer">
                                <ModalCloseIcon />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 px-8 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-medium text-black">{resource?.resource_title}</p>
                                <span className="text-sm font-medium text-gray-light">By {resource?.author?.name}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-light capitalize">
                                Level: {resource?.difficulty_level || "N/A"}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-black">Description</p>
                            <p className="text-sm text-gray-light">{resource?.resource_description || "No description provided."}</p>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-black">Skills you gain</p>
                            <div className="flex flex-wrap gap-y-2">{renderSkills()}</div>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                            <p className="font-medium text-black">Curated Links</p>
                            <div className="flex flex-col gap-2">{renderCuratedLinks()}</div>
                        </div>
                    </div>
                </>
            )}
        </ViewModal>
    );
};

export default DetailModal;