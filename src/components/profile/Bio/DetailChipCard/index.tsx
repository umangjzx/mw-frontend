import React from "react";
import TagComponent from "@/components/common/Tag";

const DetailChipCard: React.FC<DetailChipCardProps> = ({ tags, title, className }) => {
    return (
        <div className={`px-5 flex flex-col gap-3 ${className}`}>
            <p className="font-medium ">{title}</p>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <TagComponent text={tag} className="text-xs py-1 font-medium px-2" />
                ))}
            </div>
        </div>
    );
};

export default DetailChipCard;
