import React from "react";

const DetailCard: React.FC<DetailCardProps> = ({ title, description, className }) => {
    return (
        <div className={`px-5 flex flex-col gap-3 ${className}`}>
            <p className="text-sm text-gray-light font-normal">{title}</p>
            <p className="font-medium">{description}</p>
        </div>
    );
};

export default DetailCard;
