import React from "react";
import { IoStarSharp } from "react-icons/io5";

interface RatingHeaderProps {
    rating: number;
    totalReviews: number;
}

const RatingHeader = ({ rating, totalReviews }: RatingHeaderProps) => {
    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            let starColor = "#E5E7EB"; // Default gray color for empty stars

            if (rating >= starValue) {
                starColor = "#FFD700"; // Full gold for filled stars
            } else if (rating > index && rating < starValue) {
                // Only color the star if there's a partial rating
                starColor = Math.round((rating % 1) * 100) > 0 ? "#FFD700" : "#E5E7EB";
            }

            return (
                <span key={index} className="-ml-0.5">
                    <IoStarSharp className="text-[1.6rem]" style={{ color: starColor }} />
                </span>
            );
        });
    };

    return (
        <div className="flex items-center justify-between w-full gap-4 bg-[#f4f7fb] rounded-full px-5 py-6">
            <p className="font-semibold">Rating</p>
            <div className="flex items-center gap-2">
                <p className="text-[1.5rem] font-semibold">{rating}</p>
                <div className="flex items-center">{renderStars()}</div>
                <p className="text-sm font-medium">({totalReviews})</p>
            </div>
        </div>
    );
};

export default RatingHeader;
