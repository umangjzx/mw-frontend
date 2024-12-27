"use client";
import ModalCloseIcon from "@/assets/icons/ModalCloseIcon";
import ReportIcon from "@/assets/icons/ReportIcon";
import BackgroundImg from "@/assets/images/BackgroundImg.jpeg";
import Divider from "@/components/common/Divider";
import TagComponent from "@/components/common/Tag";
import Image from "next/image";
import Link from "next/link";
import HeartIcon from "@/assets/icons/HeartIcon";
import ViewModal from "@/components/common/Modals/ViewModal";
import { useQueryState } from "nuqs";
import Button from "@/components/common/Button";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { deleteResource, getSingleResource } from "@/api/resources";
import { showToast } from "@/components/common/Toast";
import { useState } from "react";

type DetailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    triggerReload: () => void;
};

const DetailModal = ({ triggerReload, isOpen, onClose }: DetailModalProps) => {
    const [category] = useQueryState("category");
    const [resourceId] = useQueryState("id");
    const [isDeleting, setIsDeleting] = useState(false);

    const [_, setMode] = useQueryState("mode");
    const isMyResource = category === "my-resources";

    const { data: resource } = useQuery({
        queryKey: ["resource-single", resourceId],
        queryFn: () => getSingleResource(resourceId || ""),
    })

    const curatedLinks = [
        {
            title: "Guitar Tuning Guide",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Finger Placement Tips",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Guitar Tuning Guide",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Finger Placement Tips",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Finger Placement Tips",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Guitar Tuning Guide",
            link: "https://example.com/guitar-tuning",
        },
        {
            title: "Finger Placement Tips",
            link: "https://example.com/guitar-tuning",
        },
    ];

    const handleEdit = () => {
        setMode("edit");
    };

    const handleDelete = async () => {
        if(!resourceId) return null;
        setIsDeleting(true)
        const res = await deleteResource(resourceId);
        if(res === 200){
            showToast({ message: "Resource Deleted" })
            triggerReload()
        }
        else showToast({ message: "Redource not deleted", type: "error" })
        onClose()
        setIsDeleting(false)
    }

    return (
        <ViewModal modalOpen={isOpen} onClose={onClose} width={800} height='720px'>
            <div className='relative w-full h-[260px] rounded-t-xl'>
                <Image src={resource?.resource_image?.image_url} fill className='object-cover' alt='background' />
                <div className='flex items-center gap-4 w-fit absolute top-4 right-4'>
                    {isMyResource ? (
                        <Button
                            onClick={handleDelete}
                            loading={isDeleting}
                            customClassName='rounded-full !px-4 !gap-1 !text-sm hover:!text-error hover:!bg-error-light !h-[35px] hover:!border-none !border-none'
                            btnVariant='error'
                            title={"Delete"}
                            icon={<IoTrashOutline size={16} />}
                        />
                    ) : (
                        <div className='h-full px-4 py-2.5 rounded-full bg-[#FEE2E299]/50 flex items-center justify-center gap-2 backdrop-blur-[5px]'>
                            <HeartIcon />
                            <p className='text-sm font-medium text-black'>{resource?.total_likes}</p>
                        </div>
                    )}
                    <span className='cursor-pointer'>
                        {isMyResource ? (
                            <Button
                                onClick={handleEdit}
                                rootClassName='!bg-background-input !px-5 !text-sm !h-[35px] hover:!border-none !border-none'
                                size='small'
                                title={"Edit"}
                                icon={<MdEdit size={16} />}
                            />
                        ) : (
                            <ReportIcon />
                        )}
                    </span>
                    <span onClick={onClose} className='cursor-pointer'>
                        <ModalCloseIcon />
                    </span>
                </div>
            </div>
            <div className='flex flex-col gap-4 px-8 pt-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <p className='text-2xl font-medium text-black'>{resource?.resource_title}</p>
                        <span className='text-sm font-medium text-gray-light'>By {resource?.author?.name}</span>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-gray-light capitalize'>Level : {resource?.difficulty_level}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium text-black'>Description</p>
                    <p className='text-sm text-gray-light'>
                        {resource?.resource_description}
                    </p>
                </div>
                <Divider />
                <div className='flex flex-col gap-2'>
                    <p className='font-medium text-black'>Skills you gain</p>
                    <div className='flex flex-wrap gap-y-2'>
                        { Array.isArray(resource?.resource_skills) && resource?.resource_skills?.map((item: any, index: number) => (
                            <TagComponent
                                key={index}
                                text={item?.skill_name}
                                className='!py-0 !px-4 !text-[0.75rem] w-fit'
                            />
                        ))}
                    </div>
                </div>
                <Divider />
                <div className='flex flex-col gap-2 max-h-[150px] overflow-y-auto'>
                    <p className='font-medium text-black'>Curated Links</p>
                    <div className='flex flex-col gap-2'>
                        {curatedLinks.map((item, index) => (
                            <p key={index}>
                                {index + 1}. {item.title} -{" "}
                                <Link
                                    href={item.link}
                                    target='_blank'
                                    className='text-primary underline'
                                >
                                    {item.link}
                                </Link>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default DetailModal;