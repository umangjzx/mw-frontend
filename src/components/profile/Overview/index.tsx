import React from "react";
import OverViewCard from "./OverViewCard";
import ClockIcon from "@/assets/icons/ClockIcon";
import LearnerConnectIcon from "@/assets/icons/LearnerConnectIcon";
import RatingHeader from "./RatingHeader";
import RatingCard from "./RatingCard";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import ReviewFilter from "./ReviewFilter";

const Overview = () => {
    const overViewCard = [
        {
            title: "Hours Volunteered",
            value: 40,
            icon: <ClockIcon />,
        },
        {
            title: "Students Connected",
            value: 40,
            icon: <LearnerConnectIcon />,
        },
    ];

    const ratingCard = {
        profileImg: DummyProfileImg,
        name: "Vinoth Kumar",
        rating: 4.5,
        day: "1d",
        review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
    };

    return (
        <div className="bg-white rounded-lg p-5">
            <RatingCard {...ratingCard} />
            <ReviewFilter />
            {/* {overViewCard.map((item, index) => (
                <OverViewCard key={index} title={item.title} value={item.value} icon={item.icon} />
            ))}
            <RatingHeader /> */}
        </div>
    );
};

export default Overview;
