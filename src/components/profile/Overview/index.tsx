import React from "react";
import OverViewCard from "./OverViewCard";
import ClockIcon from "@/assets/icons/ClockIcon";
import LearnerConnectIcon from "@/assets/icons/LearnerConnectIcon";
import RatingHeader from "./RatingHeader";
import RatingCard from "./RatingCard";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import ReviewFilter from "./ReviewFilter";
import Divider from "@/components/common/Divider";

const Overview = ({ data }: any) => {
    const overViewCard = [
        {
            title: "Hours Volunteered",
            value: data?.total_hours,
            icon: <ClockIcon />,
        },
        {
            title: "Students Connected",
            value: data?.connections,
            icon: <LearnerConnectIcon />,
        },
    ];

    const ratingCard = [
        {
            profileImg: DummyProfileImg,
            name: "Vinoth Kumar",
            rating: 4.5,
            day: "1d",
            review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
        },
        {
            profileImg: DummyProfileImg,
            name: "Vinoth Kumar",
            rating: 4.5,
            day: "1d",
            review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
        },
        {
            profileImg: DummyProfileImg,
            name: "Vinoth Kumar",
            rating: 4.5,
            day: "1d",
            review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
        },
        {
            profileImg: DummyProfileImg,
            name: "Vinoth Kumar",
            rating: 4.5,
            day: "1d",
            review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
        },
    ];

    return (
        <div className="bg-white rounded-3xl p-5 flex flex-col gap-7 h-[83vh]">
            <h2 className="text-xl font-medium">Overview</h2>
            <div className="flex gap-5">
                {overViewCard.map((item, index) => (
                    <OverViewCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                ))}
            </div>
            <Divider />
            <ReviewFilter />
            <RatingHeader rating={4.5} totalReviews={120} />
            <div className="flex flex-col gap-5 h-[60vh] overflow-y-auto">
                {ratingCard.map((item, index) => (
                    <RatingCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default Overview;
