import React from "react";

const DetailCard: React.FC<DetailCardProps> = ({ title, description, className }) => {
    return (
        <div className={`px-5 flex flex-col gap-3 ${className}`}>
            <p className="font-medium">{title}</p>
            <p className="text-sm font-medium">{description}</p>
        </div>
    );
};

export default DetailCard;
