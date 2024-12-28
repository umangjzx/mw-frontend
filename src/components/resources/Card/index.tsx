"use client";

import Image from "next/image";
import TagComponent from "@/components/common/Tag";
import FlagIcon from "@/assets/icons/FlagIcon";
import TrendArrow from "@/assets/icons/TrendArrow";


type CardProps = {
    className?: string;
    resource?: any;
    onClick: () => void;
};

const Card = ({ className, resource, onClick }: CardProps) => {
    return (
        <div className={`w-[259px] h-[313px] rounded-xl shadow-md border border-[#f7f7f7] flex flex-col justify-between ${className}`} onClick={onClick}   >
            <div className="w-full h-[120px] relative">
                <span className="absolute top-2 right-2 flex items-center gap-1 text-white z-10">
                    <TrendArrow />
                    <span className="text-[0.75rem] font-medium text-white">{resource?.total_likes} {resource?.total_likes > 1 ? 'likes' : 'like'}</span>
                </span>
                <Image
                    src={resource?.resource_image?.image_url}
                    alt="background"
                    fill
                    className="object-cover rounded-t-xl"
                />
            </div>
            <div className="flex flex-col p-3 gap-2 flex-grow justify-between">
                <div className="flex justify-between items-center ">
                    <p className="text-[0.75rem] font-medium text-gray-light">By {resource?.author?.name}</p>
                    <TagComponent className="!py-0 !px-4 !text-[0.75rem]" text={resource?.resource_category?.category_name || ""} />
                </div>
                <p className="font-medium text-black cursor-pointer">{resource?.resource_title}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-medium text-gray-light">Difficulty Level</p>
                    <p className="font-medium text-black text-sm capitalize">{resource?.difficulty_level}</p>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[0.75rem] font-medium text-primary underline cursor-pointer">
                        See more
                    </span>
                    <FlagIcon />
                </div>
            </div>
        </div>
    );
};

export default Card;
