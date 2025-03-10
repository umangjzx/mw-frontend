import React from "react";
import TagComponent from "@/components/common/Tag";

const DetailChipCard: React.FC<DetailChipCardProps> = ({ tags, title, className }) => {
    if(!title || !tags) return null;
    return (
        <div className={`px-5 flex flex-col gap-3 ${className}`}>
            <p className="font-medium ">{title}</p>
            <div className="flex flex-wrap gap-2">
                { Array.isArray(tags) ? tags?.map((tag) => (
                    <TagComponent text={tag} className="text-xs py-1 font-medium px-2" />
                )) : <TagComponent text={tags} className="text-xs py-1 font-medium px-2" /> }
            </div>
        </div>
    );
};

export default DetailChipCard;
